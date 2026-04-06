const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false }); // Prevents mongoose from creating an _id for each nested item

const cartSchema = new mongoose.Schema({
    session_id: {
        type: String,
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Update the 'updated_at' field on every save
cartSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Cart', cartSchema);
