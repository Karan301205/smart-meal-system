const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['student', 'staff', 'admin', 'guest'], // Added 'guest' role
        default: 'student' 
    },
    rollNumber: { type: String }, // Optional for guests
    
    // Guest Specific Fields
    mealsLeft: { type: Number, default: null } // null = unlimited (for regular students)
});

module.exports = mongoose.model('User', UserSchema);