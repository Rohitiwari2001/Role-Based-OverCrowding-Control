const Zone = require('../models/Zone');

exports.createZone = async (req, res) => {
    try {
        const { name, threshold_limit } = req.body;
        const newZone = new Zone({ name, threshold_limit });
        await newZone.save();
        res.status(201).json(newZone);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getAllZones = async (req, res) => {
    try {
        const zones = await Zone.find();
        res.status(200).json(zones);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateZone = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedZone = await Zone.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedZone);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.deleteZone = async (req, res) => {
    try {
        const { id } = req.params;
        await Zone.findByIdAndDelete(id);
        res.status(200).json({ message: 'Zone deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
