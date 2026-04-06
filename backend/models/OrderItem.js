const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    order_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    product_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 } // capturing price at time of purchase
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
