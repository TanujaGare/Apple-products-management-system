const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apple_prod_db';

const seedProducts = [
    // iPhone
    { name: 'iPhone 15 Pro Max', category: 'iPhone', price: 1199.00, stock: 12, description: 'The ultimate iPhone with a titanium design and A17 Pro chip.' },
    { name: 'iPhone 15', category: 'iPhone', price: 799.00, stock: 25, description: 'New 48MP camera and Dynamic Island.' },
    { name: 'iPhone 14 Plus', category: 'iPhone', price: 899.00, stock: 8, description: 'Big and powerful.' },
    { name: 'iPhone SE', category: 'iPhone', price: 429.00, stock: 30, description: 'The most affordable iPhone.' },

    // Mac
    { name: 'MacBook Air M3', category: 'MacBook', price: 1099.00, stock: 15, description: 'Strikingly thin. Fast M3 chip.' },
    { name: 'MacBook Pro 14"', category: 'MacBook', price: 1599.00, stock: 7, description: 'Powerhouse with M3 Pro or M3 Max.' },
    { name: 'iMac 24"', category: 'MacBook', price: 1299.00, stock: 4, description: 'The best all-in-one desktop.' },
    { name: 'Mac mini', category: 'MacBook', price: 599.00, stock: 10, description: 'More muscle. More hustle.' },

    // iPad
    { name: 'iPad Pro 12.9"', category: 'iPad', price: 1099.00, stock: 12, description: 'Ultimate iPad experience with M2 power.' },
    { name: 'iPad Air', category: 'iPad', price: 599.00, stock: 20, description: 'Serious performance in a thin, light design.' },
    { name: 'iPad mini', category: 'iPad', price: 499.00, stock: 18, description: 'Mega power. Mini sized.' },
    { name: 'iPad (10th Gen)', category: 'iPad', price: 449.00, stock: 25, description: 'Colorful. All-screen. Versatile.' },

    // Accessories & Vision Pro
    { name: 'Apple Vision Pro', category: 'Accessories', price: 3499.00, stock: 2, description: 'The era of spatial computing is here.' },
    { name: 'AirPods Pro (2nd Gen)', category: 'Accessories', price: 249.00, stock: 45, description: 'Adaptive Audio. Active Noise Cancellation.' },
    { name: 'Apple Pencil Pro', category: 'Accessories', price: 129.00, stock: 50, description: 'Squeeze. Barrel roll. Haptic feedback.' },
    { name: 'MagSafe Charger', category: 'Accessories', price: 39.00, stock: 100, description: 'Snaps on for effortless wireless charging.' },

    // Apple Watch
    { name: 'Apple Watch Ultra 2', category: 'Accessories', price: 799.00, stock: 10, description: 'The most capable and rugged Apple Watch.' },
    { name: 'Apple Watch Series 9', category: 'Accessories', price: 399.00, stock: 15, description: 'Smarter. Brighter. Mightier.' },
    { name: 'Apple Watch SE', category: 'Accessories', price: 249.00, stock: 22, description: 'Easy to love. Easy on the wallet.' }
];

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB.');
    try {
        await Product.deleteMany({});
        console.log('Cleared existing products.');
        
        await Product.insertMany(seedProducts);
        console.log('Successfully seeded products.');
        
        // Seed Admin User (Always reset to ensure password is hashed correctly)
        await User.deleteOne({ email: 'admin@apple.com' });
        await User.create({
            name: 'Apple Admin',
            email: 'admin@apple.com',
            password: 'admin123', // This will be hashed by the pre-save hook
            role: 'admin'
        });
        console.log('Successfully (re)seeded admin user: admin@apple.com / admin123');
    } catch (err) {
        console.error('Error seeding products:', err);
    } finally {
        mongoose.connection.close();
    }
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});
