const express = require('express');
const router = express.Router();

async function countTokens(text, model) {
    let encode;
    if (model === 'cl100k_base') {
        ({ encode } = await import('gpt-tokenizer/encoding/cl100k_base'));
    } else {
        ({ encode } = await import('gpt-tokenizer/encoding/o200k_base'));
    }
    return encode(text).length;
}

router.get('/', async (req, res) => {
    const { text, model = 'cl100k_base' } = req.query;

    if (!text) {
        return res.status(400).send('Text to analyze is required');
    }

    if (model !== 'o200k_base' && model !== 'cl100k_base') {
        return res.status(400).send('Invalid model specified. Use "o200k_base" or "cl100k_base".');
    }

    try {
        const tokenCount = await countTokens(text, model);
        res.send({ tokenCount });
    } catch (error) {
        res.status(500).send('Error trying to count tokens in the requested text.');
        console.error("llm-token-counter: ", error);
    }
});

module.exports = router;
