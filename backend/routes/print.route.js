const express=require('express');
const router=express.Router();
const multer= require("multer");
const {addPrint}=require("../controllers/print.controller")
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");
router.post("/addprint",upload,addPrint);
module.exports=router;