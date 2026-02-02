const Menu = require('../models/Menu');

// @desc    Get Today's Menu
// @route   GET /api/menu
// @access  Public (Students & Staff)
exports.getMenu = async (req, res) => {
    try {
        // Find menu for today
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const menu = await Menu.find({
            date: { $gte: today }
        });
        res.json(menu);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Add Menu Item
// @route   POST /api/menu
// @access  Admin Only
exports.addMenu = async (req, res) => {
    const { category, items } = req.body;
    try {
        const newMenu = new Menu({
            category,
            items
        });
        const menu = await newMenu.save();
        res.json(menu);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};