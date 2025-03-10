const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const db = require("../utils/db"); // Updated to use PostgreSQL with `pg`

// Multer setup (Memory Storage)
// const storage = multer.memoryStorage();
// const upload = multer({ storage }).single("file");

// const addPrint = async (req, res) => {
//   try {
//     upload(req, res, async (err) => {
//       if (err) return res.status(500).json({ error: "Multer error" });

//       const { user_id, copies, printType, printSide, description } = req.body;
//       if (!req.file || !user_id) return res.status(400).json({ error: "Missing file or user_id" });

//       // Upload file to Cloudinary
//       const result = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           { resource_type: "raw", folder: "prints" },
//           (error, cloudinaryResponse) => {
//             if (error) reject(error);
//             else resolve(cloudinaryResponse);
//           }
//         );
//         uploadStream.end(req.file.buffer);
//       });
//       console.log(req.body)

//       // Store data in PostgreSQL (Using pg client)
//       const query = `
//         INSERT INTO prints (user_id, file_url, copies, print_type, print_side, description)
//         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
//       `;

//       const values = [
//         user_id,
//         result.secure_url,
//         parseInt(copies, 10),
//         printType,
//         printSide,
//         description || null,
//       ];

//       const { rows } = await db.query(query, values);

//       return res.status(201).json({ message: "Print order added", data: rows[0] });
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Server error", details: error.message });
//   }
// };
const addPrint = async (req, res) => {
  try {
    const { copies, printType, printSide, description } = req.body;
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
    
    const query = `INSERT INTO prints (user_id, file_url, copies, print_type, print_side, description) 
                  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [user_id, result.secure_url, copies, printType, printSide, description];
    
    const { rows } = await db.query(query, values);
    return res.status(201).json({ message: "Print order added", data: rows[0] });
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
