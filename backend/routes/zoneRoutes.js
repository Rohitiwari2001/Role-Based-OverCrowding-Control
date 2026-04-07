const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zoneController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public Users can read zones
router.get('/', auth, zoneController.getAllZones);

// Only Super Admin can manipulate zones (and potentially CONTROL team can update thresholds, handled by specific route if needed)
router.post('/', auth, roleCheck(['SUPER_ADMIN']), zoneController.createZone);
router.put('/:id', auth, roleCheck(['SUPER_ADMIN', 'CONTROL']), zoneController.updateZone);
router.delete('/:id', auth, roleCheck(['SUPER_ADMIN']), zoneController.deleteZone);

module.exports = router;
