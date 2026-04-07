require('dotenv').config();
const connectDB = require('./utils/db');
const User = require('./models/User');
const Zone = require('./models/Zone');

const seedData = async () => {
    try {
        await connectDB();

        // Clear all previous data
        await User.deleteMany();
        await Zone.deleteMany();

        console.log('Cleared existing data.');

        // Add Default Zones
        const zones = await Zone.insertMany([
            { name: 'Central Station Terminal A', threshold_limit: 100, current_density: 30, status: 'Green' },
            { name: 'City Mall Ground Floor', threshold_limit: 50, current_density: 45, status: 'Yellow' },
            { name: 'Downtown Main Square', threshold_limit: 200, current_density: 195, status: 'Red' },
            { name: 'Festival Park Entrance', threshold_limit: 150, current_density: 20, status: 'Green' }
        ]);

        console.log('Inserted Zones.');

        // Add Default Users
        const superAdmin = new User({
            name: 'Alice Admin',
            email: 'admin@system.com',
            password: 'password123',
            role: 'SUPER_ADMIN',
            phone: '1234567890'
        });

        const controlTeam = new User({
            name: 'Bob Control',
            email: 'control@system.com',
            password: 'password123',
            role: 'CONTROL',
            phone: '0987654321'
        });

        const publicUser = new User({
            name: 'Charlie Public',
            email: 'public@system.com',
            password: 'password123',
            role: 'PUBLIC',
            phone: '1112223333',
            subscribed_zones: [zones[0]._id, zones[2]._id]
        });

        await superAdmin.save();
        await controlTeam.save();
        await publicUser.save();

        console.log('Inserted Users.');

        console.log('Seeding Complete! You can now log in with the above accounts (password: password123).');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
