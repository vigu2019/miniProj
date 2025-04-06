const express = require('express');
const router = express.Router();
const {paymentVerify} = require('../controllers/payment.controller');

router.post('/verify',paymentVerify);

module.exports = router;