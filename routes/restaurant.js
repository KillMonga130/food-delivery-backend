const express = require('express');
const Restaurant = require('../models/restaurant');
const auth = require('../middleware/auth');

const router = express.Router();

// Add Restaurant
router.post('/', auth, async (req, res) => {
    const { name, address, operatingHours } = req.body;

    try {
        const newRestaurant = new Restaurant({
            name,
            address,
            operatingHours,
            menu: []
        });

        const restaurant = await newRestaurant.save();
        res.status(201).json(restaurant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get All Restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

        res.json(restaurant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update Restaurant
router.put('/:id', auth, async (req, res) => {
    const { name, address, operatingHours } = req.body;

    try {
        let restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

        restaurant.name = name || restaurant.name;
        restaurant.address = address || restaurant.address;
        restaurant.operatingHours = operatingHours || restaurant.operatingHours;

        await restaurant.save();

        res.json(restaurant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete Restaurant
router.delete('/:id', auth, async (req, res) => {
    try {
        await Restaurant.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Restaurant removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
