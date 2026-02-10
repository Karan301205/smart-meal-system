const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner'],
        required: true
    },
    items: {
        type: [String],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Menu', MenuSchema);