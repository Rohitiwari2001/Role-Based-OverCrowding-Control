const Alert = require('../models/Alert');

exports.getAllAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find().populate('zone_id', 'name').sort({ createdAt: -1 });
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
