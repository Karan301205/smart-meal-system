const express = require('express');
const router = express.Router();
const { register, login, deleteUser, getAllUsers } = require('../controllers/authController'); // We will update controller next
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// LOGIN (Public - Anyone can try to login)
router.post('/login', login);

// REGISTER (Protected - Only Admin can create new users now!)
router.post('/register', protect, adminOnly, register);

// USER MANAGEMENT (Admin Only)
router.get('/users', protect, adminOnly, getAllUsers); // See list of all users
router.delete('/users/:id', protect, adminOnly, deleteUser); // Delete a user

module.exports = router;