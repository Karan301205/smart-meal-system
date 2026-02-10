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
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};


// @desc    Delete User
// @route   DELETE /api/auth/users/:id
exports.deleteUser = async (req, res) => {
    try {
        // 1. Find the user first
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // 2. THE SHIELD: Check if this is the Super Admin
        // You can hardcode the email you just created
        if (user.email === 'admin@test.com') {
            return res.status(403).json({ msg: '⛔ SUPER ADMIN CANNOT BE DELETED!' });
        }

        // 3. If safe, delete
        await user.deleteOne(); // or User.findByIdAndDelete(req.params.id)
        
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};