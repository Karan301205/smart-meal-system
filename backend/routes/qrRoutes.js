const express = require('express');
const router = express.Router();

// Import the controller functions
// We need 'getQRInfo' to show the student details BEFORE confirming
const qrController = require('../controllers/qrController'); 
const { generateQR, validateQR, getQRInfo } = qrController; 

const { protect } = require('../middlewares/authMiddleware');

// 1. Student generates QR (GET)
router.get('/generate', protect, generateQR);

// 2. Staff peeks at Student Info (POST)
// This is the missing link! 
router.post('/scan-info', protect, getQRInfo); 

// 3. Staff confirms & serves meal (POST)
router.post('/validate', protect, validateQR);

module.exports = router;