const express = require('express');
const router = express.Router();
const { getMenu, addMenu } = require('../controllers/menuController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Anyone can see the menu
router.get('/', getMenu);

// Only Admin can add menu
router.post('/', protect, admin, addMenu);

module.exports = router;