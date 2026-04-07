const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    zone_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Sensor', sensorSchema);
