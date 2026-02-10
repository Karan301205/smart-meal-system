const express = require('express');
const router = express.Router();


const qrController = require('../controllers/qrController'); 
const { generateQR, validateQR, getQRInfo } = qrController; 

const { protect } = require('../middlewares/authMiddleware');


router.get('/generate', protect, generateQR);


router.post('/scan-info', protect, getQRInfo); 


router.post('/validate', protect, validateQR);

module.exports = router;