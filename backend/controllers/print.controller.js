const cloudinary = require("../utils/cloudinary");
const db = require("../utils/db"); // Updated to use PostgreSQL with `pg`
const instance = require("../utils/razorpay"); // Razorpay instance for payment processing
const addPrint = async (req, res) => {
  try {
    const { copies, printType, printSide, description ,total } = req.body;
    const file = req.file;
    const user_id = req.user.id;
    // console.log("file upload", file);
    
    if (!file || !user_id) return res.status(400).json({ error: "Missing file or user_id" });
    
    // Create a data URI for the buffer
    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    // Upload with explicit PDF handling
    const result = await cloudinary.uploader.upload(fileStr, {
      resource_type:'auto',
      folder: 'prints',
      public_id: `${user_id}_${Date.now()}`,
      format: file.mimetype.split('/')[1] // Extract the file extension
    });
    
    const query = `INSERT INTO prints (user_id, file_url, copies, print_type, print_side, description ,total) 
                  VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *`;
    const values = [user_id, result.secure_url, copies, printType, printSide, description,total];
    
    const { rows } = await db.query(query, values);
    const printId = rows[0].id;
    const options = {
        amount: total * 100, // Amount in paise
        currency: "INR",
        receipt: printId.toString(),
    }
    const razorpayOrder = await instance.orders.create(options);
    if (!razorpayOrder) {
        return res.status(500).json({ message: "Failed to create Razorpay order", success: false });
    }
    const updateOrderQuery = `UPDATE prints SET rp_id = $1 WHERE id = $2`;
    await db.query(updateOrderQuery, [razorpayOrder.id, printId]);
    return res.status(201).json({order: razorpayOrder ,success: true,key: process.env.RAZORPAY_KEY_ID});
  }
  catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
    console.log(error);
  }
};
// Backend: Get all user prints without any status filtering
const getUserPrints = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const query = `
      SELECT * FROM prints 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    
    const { rows } = await db.query(query, [user_id]);
    
    return res.status(200).json({ 
      message: rows.length ? "User prints retrieved successfully" : "No prints found", 
      count: rows.length,
      data: rows 
    });
  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({ 
      error: "Server error", 
      message: error.message 
    });
  }
};

module.exports = { addPrint , getUserPrints };
