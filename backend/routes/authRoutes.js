const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.get('/all', auth, roleCheck(['SUPER_ADMIN']), authController.getAllUsers);
router.get('/logs', auth, roleCheck(['SUPER_ADMIN', 'CONTROL']), authController.getLoginLogs);

module.exports = router;
