const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();
// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menu', require('./routes/menuRoutes')); // <--- Add this line
// Test Route

app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;
// app.use('/api/auth', require('./routes/authRoutes'));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));