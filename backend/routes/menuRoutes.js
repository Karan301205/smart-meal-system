const express = require('express');
const router = express.Router();
const { getMenu, addMenu } = require('../controllers/menuController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');


router.get('/', getMenu);


router.post('/', protect, adminOnly, addMenu);

module.exports = router;