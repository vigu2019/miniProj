const express=require('express');
const router=express.Router();
const {addPrint}=require("../controllers/print.controller")
router.post("/addPrint",addPrint)
module.exports=router;