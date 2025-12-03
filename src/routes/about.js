const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('MSA API (Matuco19 System API) is a multi-purpose API developed in Node.js.');
});

module.exports = router;