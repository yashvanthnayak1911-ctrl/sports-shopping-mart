const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            const result = await User.deleteMany({});
            console.log(`Deleted ${result.deletedCount} users.`);
            console.log('All user data has been cleared.');
        } catch (err) {
            console.error('Error clearing users:', err);
        } finally {
            mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        }
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
