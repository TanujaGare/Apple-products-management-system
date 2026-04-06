const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    payment_method: { type: String, required: true },
    payment_status: { 
        type: String, 
        enum: ['Pending', 'Successful', 'Failed'], 
        default: 'Pending' 
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
