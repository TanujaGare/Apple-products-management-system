const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { 
        type: String, 
        required: true, 
        enum: ['iPhone', 'MacBook', 'iPad', 'Accessories'] 
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
