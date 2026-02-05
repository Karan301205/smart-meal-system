const express = require('express');
const router = express.Router();
const { generateQR, validateQR } = require('../controllers/qrController'); // <--- Import validateQR
const { protect } = require('../middlewares/authMiddleware');

// Student generates QR
router.get('/generate', protect, generateQR);

// Staff scans QR (Using POST because we are sending data)
router.post('/validate', protect, validateQR);  // <--- Add this line

module.exports = router;