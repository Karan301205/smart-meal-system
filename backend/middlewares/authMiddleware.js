const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};


exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Access Denied: Admins Only' });
    }
};