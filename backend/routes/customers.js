const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST register a new customer
router.post('/', async (req, res) => {
    try {
        // Simple check if customer with email already exists
        let customer = await Customer.findOne({ email: req.body.email });
        if (customer) {
            // Depending on flow, we might just return the existing customer
            return res.status(400).json({ message: 'Customer already exists', customer });
        }

        const newCustomer = new Customer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
