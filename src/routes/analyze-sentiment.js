const Sentiment = require('sentiment');
const express = require('express');

const router = express.Router();
const sentimentAnalyzer = new Sentiment();

function analyzeSentiment(text) {
  const result = sentimentAnalyzer.analyze(text);

  const polarity = Math.max(-1, Math.min(1, result.comparative));

  let sentiment;
  switch (Math.sign(polarity)) {
    case 1:
      sentiment = 'positive';
      break;
    case -1:
      sentiment = 'negative';
      break;
    case 0:
      sentiment = 'neutral';
      break;
    default:
      throw new Error(`Invalid polarity: ${polarity}`);
  }

  return { sentiment, polarity };
}

router.get('/', async (req, res) => {
  const text = req.query.text;
    
  if (!text) {
    return res.status(400).send('Text to analyze is required');
  }
    
  try {
    res.send(analyzeSentiment(text));
  } catch (error) {
    res.status(500).send('Error trying to analyze the requested text.');
    console.error("analyze-sentiment: ", error)
  }
});


module.exports = router;