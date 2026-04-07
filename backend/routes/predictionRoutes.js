const express = require('express');
const router = express.Router();
const predictDensity = require('../services/predictionService');
const auth = require('../middleware/auth');

// Public and internal users can view prediction
router.get('/:zone_id', auth, predictDensity);

module.exports = router;
