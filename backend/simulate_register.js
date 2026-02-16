
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Yashh-projects:yashvanth%40191104@cluster0.u27e8qb.mongodb.net/sports-ecommerce?retryWrites=true&w=majority";

const simulateRegister = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB...');

        const email = 'yashnayak1811@gmail.com'.toLowerCase().trim();

        // Check if user exists
        let user = await User.findOne({ email });
        console.log(`Searching for email: '${email}'`);
        console.log('Found user:', user);

        if (user) {
            console.log('FAIL: User already exists!');
        } else {
            console.log('SUCCESS: User does not exist, registration would proceed.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

simulateRegister();
