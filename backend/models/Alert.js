const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    zone_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
    alert_level: { type: String, enum: ['Yellow', 'Red'], required: true },
    notified_roles: [{ type: String }],
    message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
