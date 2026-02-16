
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Yashh-projects:yashvanth%40191104@cluster0.u27e8qb.mongodb.net/sports-ecommerce?retryWrites=true&w=majority";

const checkUser = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB...');

        const email = 'yashnayak1811@gmail.com';

        // Case-insensitive search to find ANY variation
        const users = await User.find({
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        });

        console.log(`Found ${users.length} matching users.`);
        users.forEach(u => {
            console.log('------------------------------------------------');
            console.log(`ID: ${u._id}`);
            console.log(`Email (Stored): "${u.email}"`);
            console.log(`Target Email:   "${email}"`);
            console.log(`Exact Match?    ${u.email === email}`);
            console.log(`Has Password?   ${!!u.password}`);
            console.log(`Role:           ${u.role}`);
            console.log('------------------------------------------------');
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkUser();
