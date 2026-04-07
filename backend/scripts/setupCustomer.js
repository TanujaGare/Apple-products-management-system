const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const setupCustomer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apple_prod_db');
        console.log('Connected to MongoDB');

        const customerData = {
            name: 'Chinmay',
            email: 'chinmay@apple.com',
            password: '123',
            role: 'customer'
        };

        const existingUser = await User.findOne({ email: customerData.email });
        if (existingUser) {
            console.log('User already exists. Updating password to 123...');
            existingUser.password = '123';
            await existingUser.save();
            console.log('User updated successfully.');
        } else {
            const newUser = await User.create(customerData);
            console.log(`Successfully created customer: ${newUser.email} (password: 123)`);
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Error setting up customer:', err);
        process.exit(1);
    }
};

setupCustomer();
