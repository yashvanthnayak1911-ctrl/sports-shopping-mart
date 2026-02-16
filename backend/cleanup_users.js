
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Yashh-projects:yashvanth%40191104@cluster0.u27e8qb.mongodb.net/sports-ecommerce?retryWrites=true&w=majority";

const cleanupUsers = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Delete all users where role is NOT 'admin'
        const result = await User.deleteMany({ role: { $ne: 'admin' } });

        console.log(`Deleted ${result.deletedCount} non-admin users.`);

        // Verify remaining users
        const remaining = await User.find({});
        console.log('\nRemaining Users:');
        remaining.forEach(u => {
            console.log(`- ${u.email} (${u.role})`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Error cleaning up users:', err);
        process.exit(1);
    }
};

cleanupUsers();
