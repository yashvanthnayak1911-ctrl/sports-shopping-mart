const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        const testEmail = 'test@example.com';
        const testPassword = 'password123';

        try {
            // Check if exists
            let user = await User.findOne({ email: testEmail });
            if (user) {
                console.log('Test user already exists. Updating password...');
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(testPassword, salt);
                await user.save();
                console.log('Test user password updated.');
            } else {
                console.log('Creating new test user...');
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(testPassword, salt);

                user = new User({
                    name: 'Test User',
                    email: testEmail,
                    password: hashedPassword,
                    role: 'user'
                });
                await user.save();
                console.log('Test user created.');
            }

            console.log(`\nSUCCESS! Credentials to use:\nEmail: ${testEmail}\nPassword: ${testPassword}\n`);

        } catch (err) {
            console.error('Error creating test user:', err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
