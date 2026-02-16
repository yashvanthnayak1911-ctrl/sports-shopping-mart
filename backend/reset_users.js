
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Yashh-projects:yashvanth%40191104@cluster0.u27e8qb.mongodb.net/sports-ecommerce?retryWrites=true&w=majority";

const resetUsers = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Delete ALL users
        const result = await User.deleteMany({});
        console.log(`Deleted ${result.deletedCount} users (WIPED ALL).`);

        process.exit(0);
    } catch (err) {
        console.error('Error resetting users:', err);
        process.exit(1);
    }
};

resetUsers();
