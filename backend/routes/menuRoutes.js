const express = require('express');
const router = express.Router();
const { getMenu, addMenu } = require('../controllers/menuController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Get Menu (Public - Students can see it)
router.get('/', getMenu);

// Add Menu (Protected - Only Admin can add food)
// The error was likely here because 'adminOnly' wasn't imported before
router.post('/', protect, adminOnly, addMenu);

module.exports = router;