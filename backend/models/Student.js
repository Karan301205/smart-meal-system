// models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student' }
});

module.exports = mongoose.model('Student', StudentSchema);