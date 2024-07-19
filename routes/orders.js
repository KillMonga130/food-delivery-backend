const express = require('express');
const Order = require('../models/order');
const Restaurant = require('../models/restaurant');
const auth = require('../middleware/auth');

const router = express.Router();

// Place Order
router.post('/', auth, async (req, res) => {
    const { restaurantId, items } = req.body;

    try {
        const user = req.user;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

        const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
        const newOrder = new Order({
            user: user.id,
            restaurant: restaurant.id,
            items,
            totalPrice,
            status: 'pending'
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get All Orders
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('restaurant');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('restaurant');
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update Order Status
router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;

    try {
        let order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        order.status = status || order.status;

        await order.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete Order
router.delete('/:id', auth, async (req, res) => {
    try {
        await Order.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Order removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
