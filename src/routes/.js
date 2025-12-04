const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('MUA API (Matuco19 Utility API) is a multi-purpose API developed in Node.js.');
    // WIP for now
});

module.exports = router;