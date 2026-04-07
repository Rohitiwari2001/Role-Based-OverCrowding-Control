module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('subscribe_zone', (zoneId) => {
            socket.join(`zone_${zoneId}`);
            console.log(`Socket ${socket.id} subscribed to zone_${zoneId}`);
        });

        socket.on('unsubscribe_zone', (zoneId) => {
            socket.leave(`zone_${zoneId}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
