const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');
const User = require('../models/User');


exports.generateQR = async (req, res) => {
    try {
       
        const payload = { userId: req.user.userId, role: req.user.role };
        
        const qrToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '60s' });

        res.json({ success: true, qrData: qrToken, message: "QR valid for 60s" });
    } catch (err) {
        console.error("QR Gen Error:", err);
        res.status(500).json({ msg: 'Server Error' });
    }
};


exports.getQRInfo = async (req, res) => {
    const { qrToken } = req.body;
    try {
        const decoded = jwt.verify(qrToken, process.env.JWT_SECRET || 'secret123');
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json({
            success: true,
            name: user.name,
            role: user.role,
            mealsLeft: user.mealsLeft,
            rollNumber: user.rollNumber
        });
    } catch (err) {
        res.status(400).json({ msg: "QR Expired or Invalid" });
    }
};

exports.validateQR = async (req, res) => {
    const { qrToken } = req.body;

    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
        return res.status(403).json({ msg: "Access Denied: Staff Only" });
    }

    try {
        const decoded = jwt.verify(qrToken, process.env.JWT_SECRET || 'secret123');
        const studentId = decoded.userId;
        const user = await User.findById(studentId);

        if (!user) return res.status(404).json({ msg: "User not found" });

      
        if (user.role === 'guest') {
            if (user.mealsLeft <= 0) return res.status(400).json({ msg: "❌ Guest Pass Expired" });
            user.mealsLeft -= 1;
            await user.save();
        }

        const currentHour = new Date().getHours();
        let mealType = 'Dinner';
        if (currentHour >= 7 && currentHour < 11) mealType = 'Breakfast';
        else if (currentHour >= 12 && currentHour < 16) mealType = 'Lunch';

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const existingTxn = await Transaction.findOne({
            studentId, 
            mealType, 
            scanTime: { $gte: startOfDay }
        });

        if (existingTxn) return res.status(400).json({ msg: `Already served ${mealType}!` });

        await new Transaction({ studentId, mealType, status: 'Success' }).save();

        res.json({ success: true, msg: "Meal Served Successfully!" });

    } catch (err) {
        res.status(400).json({ msg: "Transaction Failed" });
    }
};