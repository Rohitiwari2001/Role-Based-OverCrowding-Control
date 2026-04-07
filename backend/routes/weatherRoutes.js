const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

// Public Users can access weather data
router.get('/', weatherService);

module.exports = router;
