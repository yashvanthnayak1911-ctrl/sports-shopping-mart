
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Yashh-projects:yashvanth%40191104@cluster0.u27e8qb.mongodb.net/sports-ecommerce?retryWrites=true&w=majority";

const checkDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB...');

        const products = await Product.find({});
        console.log(`Found ${products.length} products.`);

        if (products.length > 0) {
            console.log('Sample product:', JSON.stringify(products[0], null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error('Error checking database:', err);
        process.exit(1);
    }
};

checkDB();
