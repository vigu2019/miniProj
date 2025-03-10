const {addToOrder,getUserOrders} = require('../controllers/store.controller');
const express = require('express');
const verifyToken = require('../middleware/user.middleware');
const router = express.Router();

router.post('/addorder', verifyToken, addToOrder);
router.get('/orders', verifyToken, getUserOrders);

module.exports = router;