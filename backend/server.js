require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./utils/db');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

// Middlewares
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Global Socket Access
app.set('io', io);

// Socket Setup
socketHandler(io);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/zones', require('./routes/zoneRoutes'));
app.use('/api/sensors', require('./routes/sensorRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/predictions', require('./routes/predictionRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
