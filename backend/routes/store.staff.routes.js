const express = require('express');
const router = express.Router();
const {getAllOrders,updateStatus} = require('../controllers/store.staff.controller');
const verifyToken = require('../middleware/user.middleware');
// const verifyStoreStaff = require('../middleware/store.staff.middleware');

router.get('/orders', verifyToken, getAllOrders);
router.put('/orders/status', verifyToken, updateStatus);

module.exports=router;