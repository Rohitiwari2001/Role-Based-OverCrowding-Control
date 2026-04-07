const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// In a real scenario, this would be an internal or hardware-authenticated route
// For simulation, we'll leave it unguarded or require simple basic auth, but we'll use open route for easy demo
router.post('/simulate', sensorController.simulateSensorData);

// Admin Routes for Sensor Management
router.get('/', auth, roleCheck(['SUPER_ADMIN', 'CONTROL']), sensorController.getAllSensors);
router.post('/', auth, roleCheck(['SUPER_ADMIN', 'CONTROL']), sensorController.addSensor);
router.put('/:id/toggle', auth, roleCheck(['SUPER_ADMIN', 'CONTROL']), sensorController.toggleSensorStatus);

module.exports = router;
