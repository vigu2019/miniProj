const {register,login,logout}=require('../controllers/user.controller');
const express=require('express');
const router=express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);

module.exports=router;