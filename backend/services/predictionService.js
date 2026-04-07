const SensorLog = require('../models/SensorLog');

// Simple Linear Regression prediction: y = mx + b
// Predicts what density will be in 1 hour based on recent sensor logs
const predictDensity = async (req, res) => {
    try {
        const { zone_id } = req.params;
        const logs = await SensorLog.find({ zone_id }).sort({ createdAt: -1 }).limit(20);

        if (logs.length < 2) {
            return res.status(200).json({ predicted_density: null, message: 'Not enough data for prediction' });
        }

        // Reverse to chronological order
        logs.reverse();

        // Let x = time (minutes relative to first log), y = density changes (entry - exit)
        // For simplicity, we assume continuous net additions
        let xParams = [];
        let yParams = [];
        let cumulative = 0;

        let startTime = new Date(logs[0].createdAt).getTime();

        logs.forEach(log => {
            let x = (new Date(log.createdAt).getTime() - startTime) / 60000; // minutes
            cumulative += (log.entry_count - log.exit_count);
            let y = cumulative;
            xParams.push(x);
            yParams.push(y);
        });

        const n = xParams.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

        for (let i = 0; i < n; i++) {
            sumX += xParams[i];
            sumY += yParams[i];
            sumXY += xParams[i] * yParams[i];
            sumX2 += xParams[i] * xParams[i];
        }

        const denominator = (n * sumX2) - (sumX * sumX);
        let m = 0; // Slope
        let b = 0; // Intercept

        if (denominator !== 0) {
            m = ((n * sumXY) - (sumX * sumY)) / denominator;
            b = (sumY - (m * sumX)) / n;
        }

        // Predict for 60 minutes from last log
        let lastX = xParams[xParams.length - 1];
        let futureX = lastX + 60; // 1 hr ahead

        let predicted_change = Math.round((m * futureX) + b);

        return res.status(200).json({ predicted_change, data_points: { x: xParams, y: yParams } });

    } catch (error) {
        res.status(500).json({ message: 'Prediction Error', error });
    }
};

module.exports = predictDensity;
