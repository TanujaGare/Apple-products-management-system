const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// GET cart for a session
router.get('/:sessionId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ session_id: req.params.sessionId }).populate('items.product_id');
        if (!cart) {
            // If no cart exists, create an empty one
            cart = new Cart({ session_id: req.params.sessionId, items: [] });
            await cart.save();
        }
        res.json(cart.items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add item to cart
router.post('/add', async (req, res) => {
    try {
        const { session_id, product_id, quantity } = req.body;
        
        let cart = await Cart.findOne({ session_id });
        if (!cart) {
            cart = new Cart({ session_id, items: [] });
        }
        
        const itemIndex = cart.items.findIndex(item => item.product_id.toString() === product_id);
        
        if (itemIndex > -1) {
            // Item exists, increment quantity
            cart.items[itemIndex].quantity += (quantity || 1);
        } else {
            // New item
            cart.items.push({ product_id, quantity: quantity || 1 });
        }
        
        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart: cart.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE clear cart
router.delete('/clear/:sessionId', async (req, res) => {
    try {
        await Cart.findOneAndDelete({ session_id: req.params.sessionId });
        res.json({ message: "Cart completely removed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
