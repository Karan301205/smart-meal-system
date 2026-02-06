const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');

// @desc    Generate QR Token
// @route   GET /api/qr/generate
exports.generateQR = async (req, res) => {
    try {
        const payload = {
            userId: req.user.id,
            role: req.user.role,
            timestamp: Date.now()
        };

        const qrToken = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30s' }
        );

        res.json({
            success: true,
            qrData: qrToken,
            message: "QR valid for 30s"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Validate Scanned QR
// @route   POST /api/qr/validate
// @desc    Validate Scanned QR (Staff Only)
// @route   POST /api/qr/validate
exports.validateQR = async (req, res) => {
    const { qrToken } = req.body;

    // 1. Check if the logged-in user is Staff or Admin
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
        return res.status(403).json({ msg: "Access Denied: Staff Only" });
    }

    if (!qrToken) return res.status(400).json({ msg: "No QR token provided" });

    try {
        const decoded = jwt.verify(qrToken, process.env.JWT_SECRET || 'secret123');
        const studentId = decoded.userId;

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

        if (existingTxn) {
            return res.status(400).json({ success: false, msg: `Already served ${mealType}!` });
        }

        const newTxn = new Transaction({
            studentId,
            mealType,
            status: 'Success'
        });
        await newTxn.save();

        res.json({ success: true, msg: `${mealType} Verified!`, studentId });

    } catch (err) {
        console.error(err);
        res.status(401).json({ success: false, msg: "Invalid or Expired QR" });
    }
};