const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    login_time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoginLog', loginLogSchema);
