const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const setupAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apple_prod_db');
        console.log('Connected to MongoDB');

        // 1. Delete all existing admins
        const deleteResult = await User.deleteMany({ role: 'admin' });
        console.log(`Deleted ${deleteResult.deletedCount} existing admin(s).`);

        // 2. Create the new specified admin
        const adminData = {
            name: 'Tanuja',
            email: 'tanuja123@apple.com',
            password: '123',
            role: 'admin'
        };

        const existingUser = await User.findOne({ email: adminData.email });
        if (existingUser) {
            await User.deleteOne({ email: adminData.email });
        }

        const newAdmin = await User.create(adminData);
        console.log(`Successfully created admin: ${newAdmin.email} (password: 123)`);

        mongoose.connection.close();
    } catch (err) {
        console.error('Error setting up admin:', err);
        process.exit(1);
    }
};

setupAdmin();
