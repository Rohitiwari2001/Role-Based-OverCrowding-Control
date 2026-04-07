const SensorLog = require('../models/SensorLog');
const Zone = require('../models/Zone');
const Alert = require('../models/Alert');
const Sensor = require('../models/Sensor');

const triggerAlerts = async (zone, req) => {
    let alert_level = 'Green';
    let message = '';

    const densityRatio = zone.current_density / zone.threshold_limit;

    if (densityRatio >= 1.0) {
        alert_level = 'Red';
        message = `CRITICAL: ${zone.name} is overcrowded. Density: ${zone.current_density}/${zone.threshold_limit}`;
    } else if (densityRatio >= 0.75) {
        alert_level = 'Yellow';
        message = `WARNING: ${zone.name} is filling up. Density: ${zone.current_density}/${zone.threshold_limit}`;
    }

    if (zone.status !== alert_level) {
        zone.status = alert_level;
        await zone.save();

        // Broadcast zone update via Socket
        const io = req.app.get('io');
        if (io) {
            io.emit('zoneUpdate', zone);
        }

        if (alert_level !== 'Green') {
            const notified_roles = alert_level === 'Red' ? ['SUPER_ADMIN', 'CONTROL', 'PUBLIC'] : ['SUPER_ADMIN', 'CONTROL'];
            const alert = new Alert({
                zone_id: zone._id,
                alert_level,
                message,
                notified_roles
            });
            await alert.save();

            // Broadcast new alert
            if (io) {
                io.emit('newAlert', alert);
            }

            // TODO: Trigger Email / SMS for RED alerts via nodemon/simulated service
        }
    } else {
        await zone.save();
        const io = req.app.get('io');
        if (io) {
            io.emit('zoneUpdate', zone);
        }
    }
};

exports.simulateSensorData = async (req, res) => {
    try {
        const { sensor_id, entry_count, exit_count, zone_id } = req.body;

        // If sensor_id is provided, check if it exists and is active
        if (sensor_id) {
            const sensor = await Sensor.findById(sensor_id);
            if (!sensor) return res.status(404).json({ message: 'Sensor not found' });
            if (sensor.status === 'Inactive') return res.status(403).json({ message: 'Sensor is inactive. Data rejected.' });

            // Override zone_id with the sensor's assigned zone
            var actualZoneId = sensor.zone_id;
        } else {
            // Fallback for older simulations that just pass zone_id
            var actualZoneId = zone_id;
        }

        const zone = await Zone.findById(actualZoneId);
        if (!zone) return res.status(404).json({ message: 'Zone not found' });

        // Update zone density
        const calculatedDensity = zone.current_density + entry_count - exit_count;
        zone.current_density = Math.max(0, calculatedDensity); // Can't be negative

        const sensorLog = new SensorLog({
            zone_id: actualZoneId,
            entry_count,
            exit_count
        });
        await sensorLog.save();

        await triggerAlerts(zone, req);

        res.status(200).json({ message: 'Sensor data processed', current_density: zone.current_density });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Admin Functions
exports.getAllSensors = async (req, res) => {
    try {
        const sensors = await Sensor.find().populate('zone_id', 'name');
        res.status(200).json(sensors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.addSensor = async (req, res) => {
    try {
        const { name, zone_id } = req.body;
        const sensor = new Sensor({ name, zone_id });
        await sensor.save();

        // Populate zone info before returning
        await sensor.populate('zone_id', 'name');
        res.status(201).json(sensor);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.toggleSensorStatus = async (req, res) => {
    try {
        const sensor = await Sensor.findById(req.params.id);
        if (!sensor) return res.status(404).json({ message: 'Sensor not found' });

        sensor.status = sensor.status === 'Active' ? 'Inactive' : 'Active';
        await sensor.save();

        await sensor.populate('zone_id', 'name');
        res.status(200).json(sensor);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
