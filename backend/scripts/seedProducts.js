const mongoose = require('mongoose');
const Product = require('../models/Product');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedProducts = async () => {
    try {
        // NOTE: Make sure your .env file has the correct Atlas MONGODB_URI!
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/apple_prod_db';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB to seed products...');

        const products = [
            {
                name: 'MacBook Air M3',
                category: 'MacBook',
                price: 1099,
                stock: 50,
                description: 'Strikingly thin and fast so you can work, play or create anywhere.'
            },
            {
                name: 'iPhone 15 Pro',
                category: 'iPhone',
                price: 999,
                stock: 100,
                description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip.'
            },
            {
                name: 'iPad Pro M4',
                category: 'iPad',
                price: 999,
                stock: 30,
                description: 'The thinnest Apple product ever. Peak performance in an impossibly thin design.'
            },
            {
                name: 'AirPods Pro (2nd Gen)',
                category: 'Accessories',
                price: 249,
                stock: 200,
                description: 'Up to 2x more Active Noise Cancellation than the previous generation.'
            }
        ];

        // Clear existing products if any
        await Product.deleteMany({});
        console.log('Cleared existing products.');

        // Insert new products
        await Product.insertMany(products);
        console.log('Successfully seeded database with Apple products!');

        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding products:', err);
        process.exit(1);
    }
};

seedProducts();
