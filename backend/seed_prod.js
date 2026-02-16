
const mongoose = require('mongoose');
const Product = require('./models/Product');

// HARDCODED PRODUCTION URI
const MONGODB_URI = "mongodb+srv://Yashh-projects:yashvanth%40191104@cluster0.u27e8qb.mongodb.net/sports-ecommerce?retryWrites=true&w=majority";

const products = [
    {
        name: "Elite Pro Basketball",
        category: "Basketball",
        description: "Official size and weight, premium leather grip for indoor/outdoor play.",
        price: 49.99,
        stock: 50,
        image: "https://images.unsplash.com/photo-1519861531473-920026393112?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Carbon Fiber Tennis Racket",
        category: "Tennis",
        description: "Lightweight carbon fiber frame for maximum control and power.",
        price: 129.99,
        stock: 30,
        image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Pro-Grip Yoga Mat",
        category: "Yoga",
        description: "Non-slip surface, extra thick for comfort and stability.",
        price: 35.00,
        stock: 100,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Speedster Running Shoes",
        category: "Running",
        description: "Aerodynamic design with breathable mesh and cushioned sole.",
        price: 89.99,
        stock: 45,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Professional Football (Soccer)",
        category: "Football",
        description: "FIFA quality pro match ball, seamless surface for predictable trajectory.",
        price: 65.00,
        stock: 60,
        image: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Heavy Duty Gym Bag",
        category: "Accessories",
        description: "Spacious compartments with dedicated shoe section and water resistant.",
        price: 45.50,
        stock: 80,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Performance Cycling Helmet",
        category: "Cycling",
        description: "Aerodynamic ventilation, lightweight impact protection.",
        price: 75.00,
        stock: 40,
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Swimming Goggles Pro",
        category: "Swimming",
        description: "Anti-fog, UV protection with adjustable silicone strap.",
        price: 22.99,
        stock: 120,
        image: "https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to REMOTE MongoDB...');

        // FORCE CLEAR AND SEED
        await Product.deleteMany({});
        console.log('Cleared existing products');

        await Product.insertMany(products);
        console.log(`Successfully seeded ${products.length} products to REMOTE DB!`);

        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
