const db = require('../utils/db')
const { sendEmail } = require('../utils/mailer');
const getAllPrints = async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.file_url, p.copies, p.print_type, p.print_side, p.description, 
                   p.created_at, p.status, u.fullname as user_name
            FROM prints p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `;
        const { rows: prints } = await db.query(query);

        if (prints.length === 0) {
            return res.status(200).json({ items: [], success: true });
        }

        return res.status(200).json({ items: prints, success: true });
    } catch (error) {
        console.error('Error fetching prints:', error);
        return res.status(500).json({ error: error.message, success: false });
    }
};
const updateStatus = async (req, res) => {
    const { printId, status } = req.body;
    // console.log(printId, status)
    try {
        const query = `UPDATE prints SET status = $1 WHERE id = $2 RETURNING *`;
        const { rows } = await db.query(query, [status, printId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Print not found', success: false });
        }
        
        // Only send email notification if status is "completed"
        if (status.toLowerCase() === "completed") {
            const userId = rows[0].user_id;
            const userQuery = `SELECT email FROM users WHERE id = $1`;
            const { rows: userRows } = await db.query(userQuery, [userId]);
            if (userRows.length === 0) {
                return res.status(404).json({ message: 'User not found', success: false });
            }
            
            const userEmail = userRows[0].email;
            const subject = 'Your Print is Ready!';
            
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
                        background-color: #4CAF50;
                        color: white;
                        padding: 15px;
                        text-align: center;
                        border-radius: 5px 5px 0 0;
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
                        background-color: #4CAF50;
                        color: white;
                        border-radius: 3px;
                        font-weight: bold;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 0.9em;
                        color: #777;
                    }
                    .button {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 4px;
                        font-weight: bold;
                        margin-top: 15px;
                    }
                    .completion-icon {
                        font-size: 48px;
                        text-align: center;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Your Print is Ready! 🎉</h2>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>Great news! Your print request has been completed and is now ready for pickup.</p>
                        
                        <div class="completion-icon">✅</div>
                        
                        <div class="print-details">
                            <h3>Print Request Details</h3>
                            
                            <div class="detail-row">
                                <div class="detail-label">Request ID:</div>
                                <div>#${printId}</div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-label">Date Completed:</div>
                                <div>${new Date().toLocaleDateString()} </div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-label">Status:</div>
                                <div><span class="status">Completed</span></div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-label">Copies:</div>
                                <div>${rows[0].copies}</div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-label">Print Type:</div>
                                <div>${rows[0].print_type}</div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-label">Print Side:</div>
                                <div>${rows[0].print_side}</div>
                            </div>
                        </div>
                        
                        <p>You can pick up your prints from our service desk during operating hours. Please have your request ID ready for reference.</p>
                        
                        <p>Thank you for using our printing service!</p>
                        
                    </div>
                    <div class="footer">
                        <p>If you have any questions, please contact our customer service.</p>
                        <p>&copy; ${new Date().getFullYear()} CampusEase</p>
                    </div>
                </div>
            </body>
            </html>
            `;
            
            const emailSent = await sendEmail(userEmail, subject, htmlContent);
            if (!emailSent) {
                return res.status(500).json({ message: 'Failed to send email notification', success: false });
            }
        }
        
        return res.status(200).json({ message: 'Print status updated successfully', print: rows[0], success: true });
    } catch (error) {
        console.error('Error updating print status:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllPrints,
    updateStatus
};