const express = require('express');
const router = express.Router();
const {getAllPrints, updateStatus} = require('../controllers/print.staff.controller')
const verifyToken = require('../middleware/user.middleware')
router.get('/prints',verifyToken, getAllPrints)
router.put('/prints',verifyToken, updateStatus)

module.exports = router;