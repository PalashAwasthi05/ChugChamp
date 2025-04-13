const express = require('express');
const calculateBAC = require('../utils/bacCalculator');
const BACRecord = require('../models').BACRecord;
const User = require('../models').User;
const router = express.Router();

// POST /api/bac/test
router.post('/test', async (req, res) => {
  try {
    const { userId, measuredBAC, timeSinceShotMinutes } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const elapsedTimeHrs = timeSinceShotMinutes / 60;
    const alcoholGrams = 18.67; // one 2oz shot (59.14 ml * 40% * 0.789)
    const calculatedBAC = calculateBAC(alcoholGrams, user.weight, user.gender, elapsedTimeHrs, user.metabolism);

    // Record the BAC data
    await BACRecord.create({
      userId,
      consumptionOz: 2,
      timeOfConsumption: new Date(Date.now() - timeSinceShotMinutes * 60000),
      measuredBAC,
      calculatedBAC,
      recordedAt: new Date()
    });

    res.status(201).json({ calculatedBAC, measuredBAC });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
