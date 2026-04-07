const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Super Admin and Control teams can view all alert history
router.get('/', auth, roleCheck(['SUPER_ADMIN', 'CONTROL']), alertController.getAllAlerts);

module.exports = router;
