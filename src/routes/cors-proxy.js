const express = require('express');
const { pipeline, Readable } = require('stream');
const { PassThrough } = require('stream');

const router = express.Router();

const cache = new Map();
const MAX_CACHE_ENTRIES = 100; // keep memory reasonable
const DEFAULT_TTL_SECONDS = 60; // 1 min

function setCache(key, value, ttlSeconds = DEFAULT_TTL_SECONDS) {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
  cache.set(key, { ...value, expiresAt });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry;
}

function validateUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

router.options('/', (req, res) => {
  // CORS preflight
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).send();
});

router.get('/', async (req, res) => {
  const target = req.query.url;
  const raw = (req.query.raw || '').toString().toLowerCase() === 'true' || req.query.raw === '1';
  const timeout = Math.max(3000, parseInt(req.query.timeout, 10) || 10000); // ms
  const cacheTtl = parseInt(req.query.cache_ttl, 10) || DEFAULT_TTL_SECONDS;
  const cacheKey = `${raw ? 'raw:' : 'json:'}${target}`;

  res.set('Access-Control-Allow-Origin', '*');
  if (!target) {
    return res.status(400).json({ error: 'Missing `url` query parameter' });
  }

  if (!validateUrl(target)) {
    return res.status(400).json({ error: 'Invalid `url` scheme. Only http/https allowed.' });
  }

  const cached = getCache(cacheKey);
  if (cached) {
    if (raw) {
      res.set('Content-Type', cached.contentType || 'application/octet-stream');
      res.set('X-Proxy-Cache', 'HIT');
      return res.status(cached.statusCode || 200).send(Buffer.from(cached.body, 'base64'));
    }
    res.set('X-Proxy-Cache', 'HIT');
    return res.status(200).json({ contents: cached.body, status: { http_code: cached.statusCode || 200, content_type: cached.contentType || 'text/plain' } });
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const fetched = await fetch(target, { headers: { 'User-Agent': 'MUA-API CORS Proxy' }, signal: controller.signal });
    clearTimeout(id);

    if (raw) {
      res.set('X-Proxy-Cache', 'MISS');
      const contentType = fetched.headers.get('content-type') || 'application/octet-stream';
      const statusCode = fetched.status;
      res.set('Content-Type', contentType);
      res.status(statusCode);

      const r = new PassThrough();
      const chunks = [];
      if (!fetched.body) {
        setCache(cacheKey, { body: '', contentType, statusCode }, cacheTtl);
        return res.status(statusCode).end();
      }

      let nodeStream;
      const isNodeReadable = fetched.body && typeof fetched.body.pipe === 'function' && typeof fetched.body.on === 'function';
      const isWebStream = fetched.body && typeof fetched.body.getReader === 'function';
      if (isNodeReadable) {
        nodeStream = fetched.body;
      } else if (isWebStream && typeof Readable.fromWeb === 'function') {
        nodeStream = Readable.fromWeb(fetched.body);
      } else if (isWebStream) {
        try {
          const ab = await fetched.arrayBuffer();
          nodeStream = Readable.from(Buffer.from(ab));
        } catch (e) {
          console.error('cors-proxy: failed to convert web stream to node stream.', e);
          return res.status(500).json({ error: 'Failed to stream target content' });
        }
      } else if (fetched.body instanceof ArrayBuffer || ArrayBuffer.isView(fetched.body)) {
        nodeStream = Readable.from(Buffer.from(fetched.body));
      } else {
        try {
          const ab = await fetched.arrayBuffer();
          nodeStream = Readable.from(Buffer.from(ab));
        } catch (e) {
          console.error('cors-proxy: unexpected body type', e);
          return res.status(500).json({ error: 'Unsupported target response type' });
        }
      }

      nodeStream.on('data', c => chunks.push(c));
      nodeStream.on('error', err => {
        console.error('cors-proxy stream error:', err);
        try { res.end(); } catch (e) {}
      });
      nodeStream.on('end', () => {
        try {
          const buffer = Buffer.concat(chunks);
          if (buffer.length <= 1_048_576) { // 1 MB
            setCache(cacheKey, { body: buffer.toString('base64'), contentType, statusCode }, cacheTtl);
          }
        } catch (err) {
          // ignore
        }
      });
      pipeline(nodeStream, r, (err) => {
        if (err) {
          console.error('cors-proxy pipeline error', err);
        }
      });
      r.pipe(res);
    } else {
      res.set('X-Proxy-Cache', 'MISS');
      // json mode: return text content
      const contentType = fetched.headers.get('content-type') || 'text/plain';
      const statusCode = fetched.status;
      // avoid enormous responses limiting it to 2MB
      const MAX_TEXT_BYTES = 2_097_152;
      const text = await fetched.text();
      if (Buffer.byteLength(text, 'utf8') > MAX_TEXT_BYTES) {
        return res.status(413).json({ error: 'Fetched content too large.' });
      }

      setCache(cacheKey, { body: text, contentType, statusCode }, cacheTtl);
      return res.json({ contents: text, status: { http_code: statusCode, content_type: contentType } });
    }
  } catch (err) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Request to target timed out.' });
    }
    console.error('cors-proxy: ', err);
    return res.status(500).json({ error: 'Failed to fetch target URL.' });
  }
});

module.exports = router;
