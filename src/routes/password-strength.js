const express = require('express');
const router = express.Router();
const { check } = require('password-strength-tester');

router.post('/', (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    const strength = check(password);

    const crackTime = (strength) => {
        if (strength < 30) return 'Instantly';
        if (strength < 50) return 'Seconds to minutes';
        if (strength < 70) return 'Hours to weeks';
        if (strength < 90) return 'Months to years';
        return 'Centuries';
    }

    res.json({
        strength_percentage: strength.score,
        strength_text: strength.strength,
        estimated_crack_time: crackTime(strength.score)
    });
});

module.exports = router;
