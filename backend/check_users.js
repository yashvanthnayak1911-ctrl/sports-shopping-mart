const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        try {
            const users = await User.find({}, 'name email role createdAt');
            console.log('\n--- Registered Users ---');
            if (users.length === 0) {
                console.log('No users found in database.');
            } else {
                users.forEach(user => {
                    console.log(`ID: ${user._id}`);
                    console.log(`Name: ${user.name}`);
                    console.log(`Email: '${user.email}'`); // Quotes to reveal whitespace
                    console.log(`Role: ${user.role}`);
                    console.log('------------------------');
                });
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        }
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
