const express=require('express');
const router=express.Router();
const multer= require("multer");
const {addPrint,getUserPrints}=require("../controllers/print.controller")
const verifyToken = require('../middleware/user.middleware');
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");
router.post("/addprint",verifyToken,upload,addPrint);
router.get('/userprints',verifyToken,getUserPrints);
module.exports=router;