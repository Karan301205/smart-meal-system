const Menu = require('../models/Menu');


exports.getMenu = async (req, res) => {
    try {
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