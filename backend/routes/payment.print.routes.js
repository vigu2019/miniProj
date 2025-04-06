const express = require('express');
const router = express.Router();
const {paymentVerifyPrint} = require('../controllers/payment.controller');

router.post('/verify',paymentVerifyPrint);

module.exports = router;