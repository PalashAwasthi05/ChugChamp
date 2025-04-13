const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});


const authRoutes = require('./routes/auth');
const bacRoutes = require('./routes/bac');
const friendsRoutes = require('./routes/friends');

app.use('/api/auth', authRoutes);
app.use('/api/bac', bacRoutes);
app.use('/api/friends', friendsRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
