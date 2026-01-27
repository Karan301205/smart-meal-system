const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect Routes (Check if logged in)
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            req.user = await User.findById(decoded.user.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

// 2. Admin Only (Check role)
exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ msg: 'Not authorized as an admin' });
    }
};
