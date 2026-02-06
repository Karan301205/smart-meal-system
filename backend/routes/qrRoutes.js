const express = require('express');
const router = express.Router();

// Import the controller functions
// If this path is wrong or the file has a typo, it crashes
const qrController = require('../controllers/qrController'); 

// Destructure them safely
const { generateQR, validateQR } = qrController;

const { protect } = require('../middlewares/authMiddleware');

// Debugging check: If these are undefined, we know the issue is the controller file
if (!generateQR || !validateQR) {
    console.error("❌ ERROR: QR Controller functions not found. Check 'qrController.js' exports!");
}

// Student generates QR
router.get('/generate', protect, generateQR);

// Staff scans QR
router.post('/validate', protect, validateQR);

module.exports = router;