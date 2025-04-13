const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models').User; 
const router = express.Router();

// POST /api/auth/register
router.post('/register', [
  body('username').isLength({ min: 4 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('height').isFloat({ gt: 0 }),
  body('weight').isFloat({ gt: 0 }),
  body('age').isInt({ gt: 0 }),
  body('gender').isIn(['male', 'female', 'other'])
], async (req, res) => {
  console.log('>>> HIT /api/auth/register with body:', req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('>>> Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { username, email, password, height, weight, age, gender, metabolism } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username, email, password: hashedPassword, height, weight, age, gender,
      metabolism: metabolism || 0.017
    });
    // TODO: Trigger email verification via SendGrid
    res.status(201).json({ message: 'User registered. Verification email sent.' });
  } catch (err) {
    console.error('>>> Caught error in /api/auth/register:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login (for authentication and JWT generation)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });
    
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
