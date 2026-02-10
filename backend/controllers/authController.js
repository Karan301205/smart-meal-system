const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const generateToken = (id, role) => {
    return jwt.sign({ userId: id, role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
};


exports.register = async (req, res) => {
    const { name, email, password, role, rollNumber, mealsLeft } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // If role is guest, use the provided mealsLeft (e.g., 5 meals). Otherwise null (unlimited).
        const guestLimit = role === 'guest' ? (mealsLeft || 1) : null;

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            rollNumber,
            mealsLeft: guestLimit
        });

        await user.save();
        res.status(201).json({ msg: 'User created successfully', user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const token = generateToken(user.id, user.role);
        
        res.json({ token, role: user.role, name: user.name });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        // Return all users but hide their passwords
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User removed' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};