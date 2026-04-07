const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET cart for a session
router.get('/:sessionId', async (req, res) => {
    try {
        console.log(`[CART] Fetching cart for session: ${req.params.sessionId}`);
        let cart = await Cart.findOne({ session_id: req.params.sessionId }).populate('items.product_id');
        
        if (!cart) {
            console.log(`[CART] No cart found. Creating new for: ${req.params.sessionId}`);
            cart = new Cart({ session_id: req.params.sessionId, items: [] });
            await cart.save();
        }
        
        console.log(`[CART] Returning ${cart.items.length} items for session.`);
        res.json(cart.items);
    } catch (err) {
        console.error(`[CART ERROR] Get failed:`, err);
        res.status(500).json({ error: err.message });
    }
});

// POST add item to cart
router.post('/add', async (req, res) => {
    try {
        const { session_id, product_id, quantity } = req.body;
        console.log(`[CART] Adding product ${product_id} to session ${session_id}`);

        if (!product_id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        // Verify product exists
        const product = await Product.findById(product_id);
        if (!product) {
            console.error(`[CART ERROR] Product not found: ${product_id}`);
            return res.status(404).json({ error: "Product not found" });
        }
        
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
        console.log(`[CART] Successfully saved cart for session ${session_id}`);
        res.status(200).json({ message: "Item added to cart", cart: cart.items });
    } catch (err) {
        console.error(`[CART ERROR] Add failed:`, err);
        res.status(400).json({ error: err.message });
    }
});

// DELETE remove single item
router.delete('/remove/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { productId } = req.query;
        console.log(`[CART] Removing item ${productId} from session: ${sessionId}`);
        
        const cart = await Cart.findOne({ session_id: sessionId });
        if (cart) {
            cart.items = cart.items.filter(item => item.product_id.toString() !== productId);
            await cart.save();
        }
        
        res.json({ message: "Item removed" });
    } catch (err) {
        console.error(`[CART ERROR] Remove item failed:`, err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE clear cart
router.delete('/clear/:sessionId', async (req, res) => {
    try {
        console.log(`[CART] Clearing cart for session: ${req.params.sessionId}`);
        await Cart.findOneAndDelete({ session_id: req.params.sessionId });
        res.json({ message: "Cart completely removed" });
    } catch (err) {
        console.error(`[CART ERROR] Clear failed:`, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
