const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const db = require("../utils/db"); // Updated to use PostgreSQL with `pg`

// Multer setup (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const addPrint = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) return res.status(500).json({ error: "Multer error" });

      const { user_id, copies, printType, printSide, description } = req.body;
      if (!req.file || !user_id) return res.status(400).json({ error: "Missing file or user_id" });

      // Upload file to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "raw", folder: "prints" },
          (error, cloudinaryResponse) => {
            if (error) reject(error);
            else resolve(cloudinaryResponse);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      // Store data in PostgreSQL (Using pg client)
      const query = `
        INSERT INTO prints (user_id, file_url, copies, print_type, print_side, description)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
      `;

      const values = [
        user_id,
        result.secure_url,
        parseInt(copies, 10),
        printType,
        printSide,
        description || null,
      ];

      const { rows } = await db.query(query, values);

      return res.status(201).json({ message: "Print order added", data: rows[0] });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = { addPrint };
