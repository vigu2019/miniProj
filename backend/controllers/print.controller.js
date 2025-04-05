const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const db = require("../utils/db"); // Updated to use PostgreSQL with `pg`
const {sendEmail} = require("../utils/mailer");
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
    
    //send email notification to the user
    const userQuery = `SELECT email FROM users WHERE id = $1`;
    const { rows: userRows } = await db.query(userQuery, [user_id]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const userEmail = userRows[0].email;
    const subject = "Print Request Confirmation";
    
    // Create HTML email content
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
            }
            .container {
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            .header {
                background-color: #f8f9fa;
                padding: 15px;
                text-align: center;
                border-bottom: 1px solid #ddd;
            }
            .content {
                padding: 20px 0;
            }
            .print-details {
                margin: 20px 0;
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
            }
            .detail-row {
                display: flex;
                margin-bottom: 10px;
            }
            .detail-label {
                font-weight: bold;
                width: 140px;
            }
            .status {
                display: inline-block;
                padding: 5px 10px;
                background-color: #ffc107;
                color: #000;
                border-radius: 3px;
                font-weight: bold;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 0.9em;
                color: #777;
            }
            .file-preview {
                width: 100%;
                max-height: 150px;
                background-color: #f0f0f0;
                border: 1px dashed #ccc;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 15px 0;
                padding: 15px 0;
            }
            .file-icon {
                font-size: 48px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Print Request Confirmation</h2>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>Thank you for your print request! We're pleased to confirm that your request has been received and is being processed.</p>
                
                <div class="print-details">
                    <h3>Print Request Details</h3>
                    
                    <div class="detail-row">
                        <div class="detail-label">Request ID:</div>
                        <div>#${rows[0].id}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Date Submitted:</div>
                        <div>${new Date(rows[0].created_at).toLocaleDateString()}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Status:</div>
                        <div><span class="status">Pending</span></div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Number of Copies:</div>
                        <div>${copies}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Print Type:</div>
                        <div>${printType}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Print Side:</div>
                        <div>${printSide}</div>
                    </div>
                    
                    ${description ? `
                    <div class="detail-row">
                        <div class="detail-label">Description:</div>
                        <div>${description}</div>
                    </div>
                    ` : ''}
                    
                    <div class="file-preview">
                        <div class="file-icon">📄</div>
                    </div>
                    
                    <p>Your file has been uploaded successfully.</p>
                </div>
                
                <p>We will process your print request as soon as possible. You will receive another notification when your prints are ready for pickup.</p>
            </div>
            <div class="footer">
                <p>If you have any questions about your print request, please contact our customer service.</p>
                <p>&copy; ${new Date().getFullYear()} CampusEase</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const emailSent = await sendEmail(userEmail, subject, htmlContent);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send email notification" });
    }
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
