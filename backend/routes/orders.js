const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const { protect, admin } = require('../middleware/authMiddleware');

// GET all orders with populated customer details
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('customer_id').sort({ order_date: -1 });
        
        // Fetch order items and payments for each order to construct a full response
        const fullOrders = await Promise.all(orders.map(async (order) => {
            const items = await OrderItem.find({ order_id: order._id }).populate('product_id');
            const payment = await Payment.findOne({ order_id: order._id });
            return {
                ...order.toObject(),
                items,
                payment
            };
        }));
        
        res.json(fullOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST place a new order
// Expected body: { customer_id: '...', items: [ { product_id: '...', quantity: 1 } ], payment_method: 'Card' }
router.post('/', async (req, res) => {
    try {
        const { customer_id, items, payment_method } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Order must contain at least one item" });
        }

        let totalAmount = 0;
        const processedItems = [];

        // 1. Calculate total and check/deduct stock
        for (let item of items) {
            const product = await Product.findById(item.product_id);
            if (!product) {
                return res.status(404).json({ error: `Product not found: ${item.product_id}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for product: ${product.name}` });
            }
            
            // Deduct stock
            product.stock -= item.quantity;
            await product.save();
            
            totalAmount += product.price * item.quantity;
            processedItems.push({
                product_id: product._id,
                quantity: item.quantity,
                price: product.price // Lock in price
            });
        }

        // 2. Create the Order
        const newOrder = new Order({
            customer_id,
            total_amount: totalAmount,
            status: 'Pending'
        });
        const savedOrder = await newOrder.save();

        // 3. Create Order Items
        for (let item of processedItems) {
            const orderItem = new OrderItem({
                order_id: savedOrder._id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            });
            await orderItem.save();
        }

        // 4. Track Payment
        const currentPaymentMethod = payment_method || 'Credit Card'; // Default
        const payment = new Payment({
            order_id: savedOrder._id,
            payment_method: currentPaymentMethod,
            payment_status: 'Successful' // Simulating successful payment
        });
        await payment.save();

        // If everything is successful, update order status to Completed
        savedOrder.status = 'Completed';
        await savedOrder.save();
        
        res.status(201).json({ 
            message: 'Order placed successfully', 
            order_id: savedOrder._id 
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update order status
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Completed', 'Cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
