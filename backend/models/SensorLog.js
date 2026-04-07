const mongoose = require('mongoose');

const sensorLogSchema = new mongoose.Schema({
    zone_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
    entry_count: { type: Number, default: 0 },
    exit_count: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('SensorLog', sensorLogSchema);
