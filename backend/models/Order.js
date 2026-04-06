const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Customer', 
        required: true 
    },
    order_date: { type: Date, default: Date.now },
    total_amount: { type: Number, required: true, min: 0 },
    status: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Cancelled'], 
        default: 'Pending' 
    }
});

module.exports = mongoose.model('Order', orderSchema);
