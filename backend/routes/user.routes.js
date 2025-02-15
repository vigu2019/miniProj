const {register,login,logout,updatePassword,updateProfile}=require('../controllers/user.controller');
const  verifyToken = require('../middleware/user.middleware');
const express=require('express');
const router=express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);
router.put('/update-password',verifyToken,updatePassword);
router.put('/update-profile',verifyToken,updateProfile);

module.exports=router;