const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    threshold_limit: { type: Number, required: true },
    current_density: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Green', 'Yellow', 'Red'],
        default: 'Green'
    }
}, { timestamps: true });

module.exports = mongoose.model('Zone', zoneSchema);
