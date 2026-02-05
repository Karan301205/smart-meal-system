const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner'],
        required: true
    },
    scanTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Success', 'Failed'],
        default: 'Success'
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);