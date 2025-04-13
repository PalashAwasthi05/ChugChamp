const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const User = require('../models').User;
const BACRecord = require('../models').BACRecord;
const Friendship = require('../models').Friendship;
const estimateTolerance = require('../utils/toleranceEstimator');

// POST /api/friends/add
router.post('/add', async (req, res) => {
  const { requesterId, friendId } = req.body;
  try {
    await Friendship.create({ requesterId, friendId, status: 'accepted' });
    res.status(201).json({ message: 'Friend added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/friends/rankings?userId=xxx
router.get('/rankings', async (req, res) => {
  const { userId } = req.query;
  try {
    const friendships = await Friendship.findAll({
      where: {
        [Op.or]: [{ requesterId: userId }, { friendId: userId }],
        status: 'accepted'
      }
    });

    const friendIds = friendships.map(f =>
      f.requesterId == userId ? f.friendId : f.requesterId
    );

    const friendData = await Promise.all(friendIds.map(async (id) => {
      const friend = await User.findByPk(id);
      const latestBAC = await BACRecord.findOne({ where: { userId: id }, order: [['recordedAt', 'DESC']] });
      if (!latestBAC) return null;
      const tolerance = estimateTolerance(latestBAC.calculatedBAC, friend.weight, friend.gender);
      // Using the 'tipsy' threshold as a tolerance score benchmark
      return { username: friend.username, currentBAC: latestBAC.calculatedBAC, toleranceScore: tolerance.tipsy };
    }));

    const ranking = friendData.filter(item => item)
      .sort((a, b) => b.toleranceScore - a.toleranceScore);

    res.json(ranking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
