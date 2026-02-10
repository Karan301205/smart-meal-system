const express = require('express');
const router = express.Router();
const { register, login, deleteUser, getAllUsers } = require('../controllers/authController'); 
const { protect, adminOnly } = require('../middlewares/authMiddleware');


router.post('/login', login);


router.post('/register', protect, adminOnly, register);


router.get('/users', protect, adminOnly, getAllUsers); 
router.delete('/users/:id', protect, adminOnly, deleteUser); 

module.exports = router;