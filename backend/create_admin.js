
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MONGODB_URI from .env or hardcoded fallbacks
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Yashh-projects:yashvanth%40191104@cluster0.u27e8qb.mongodb.net/sports-ecommerce?retryWrites=true&w=majority";

const createAdmin = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB...');

        const adminEmail = 'admin@sports.com';
        const adminPassword = 'adminpassword123';

        // Check if admin exists
        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log('Admin user already exists.');
            // Optionally update role to ensure text is correct
            admin.role = 'admin';
            await admin.save();
            console.log('Ensure role is set to admin.');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            admin = new User({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                mobile: '0000000000',
                role: 'admin'
            });

            await admin.save();
            console.log('Admin user created successfully!');
        }

        console.log(`\nLogin Credentials:\nEmail: ${adminEmail}\nPassword: ${adminPassword}`);
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();
