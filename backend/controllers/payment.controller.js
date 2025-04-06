const crypto = require('crypto');
const {sendEmail} = require('../utils/mailer');
const db = require("../utils/db");
const paymentVerify = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const secret = process.env.RAZORPAY_SECRET;
        
        const generated_signature = crypto.createHmac('sha256', secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');
            
        const isSignatureValid = generated_signature === razorpay_signature;
        
        if (isSignatureValid) {
            // Payment is successful, update your database accordingly
            //set order status to paid
            const query = `UPDATE orders SET payment_status = $1 WHERE rp_id = $2`;
            await db.query(query, ["paid", razorpay_order_id]);
            const insertQuery = `INSERT INTO razorpay_payments (razorpay_order_id, razorpay_payment_id, razorpay_signature) VALUES ($1, $2, $3)`;
            await db.query(insertQuery, [razorpay_order_id, razorpay_payment_id, razorpay_signature]);
            
            // Get order details for email
            const orderQuery = `
                SELECT o.id, o.user_id, o.order_date, o.status, o.total 
                FROM orders o 
                WHERE o.rp_id = $1`;
            const { rows: orderRows } = await db.query(orderQuery, [razorpay_order_id]);
            
            if (orderRows.length === 0) {
                return res.status(404).json({ message: "Order not found" });
            }
            
            const order = orderRows[0];
            
            // Get order items
            const itemsQuery = `
                SELECT name, price, quantity 
                FROM order_items 
                WHERE order_id = $1`;
            const { rows: orderItems } = await db.query(itemsQuery, [order.id]);
            
            // Get user email
            const emailQuery = `SELECT email FROM users WHERE id = $1`;
            const { rows: emailRows } = await db.query(emailQuery, [order.user_id]);
            
            if (emailRows.length === 0) {
                return res.status(404).json({ message: "User email not found" });
            }
            
            const userEmail = emailRows[0].email;
            const subject = "Order Confirmation";
            
            // Create HTML email content with order summary
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
                    .order-details {
                        margin: 20px 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 12px 15px;
                        border-bottom: 1px solid #ddd;
                        text-align: left;
                    }
                    th {
                        background-color: #f8f9fa;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 0.9em;
                        color: #777;
                    }
                    .status {
                        display: inline-block;
                        padding: 5px 10px;
                        background-color: #ffc107;
                        color: #000;
                        border-radius: 3px;
                        font-weight: bold;
                    }
                    .total-row {
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Order Confirmation</h2>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>Thank you for your order! We're pleased to confirm that your order has been received and is being processed.</p>
                        
                        <div class="order-details">
                            <p><strong>Order ID:</strong> #${order.id}</p>
                            <p><strong>Order Date:</strong> ${new Date(order.order_date).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> <span class="status">Pending</span></p>
                        </div>
                        
                        <h3>Order Summary</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orderItems.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.quantity}</td>
                                        <td>₹${parseFloat(item.price).toFixed(2)}</td>
                                        <td>₹${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                                <tr class="total-row">
                                    <td colspan="3" style="text-align: right;">Total:</td>
                                    <td>₹${parseFloat(order.total).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="footer">
                        <p>If you have any questions about your order, please contact our customer service.</p>
                        <p>&copy; ${new Date().getFullYear()} CampusEase</p>
                    </div>
                </div>
            </body>
            </html>
            `;
            
            // Pass the HTML content directly to the sendEmail function
            const emailSent = await sendEmail(userEmail, subject, htmlContent);
            
            if (!emailSent) {
                console.log("Failed to send email notification");
                // Continue with the response even if email fails
            }
            res.redirect(`${process.env.CLIENT_URL}/payment-success?order_id=${razorpay_order_id}`);
        } else {
            res.status(400).json({ message: "Payment verification failed", success: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
        console.log(error);
    }
}
const paymentVerifyPrint = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const secret = process.env.RAZORPAY_SECRET;
        
        const generated_signature = crypto.createHmac('sha256', secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');
            
        const isSignatureValid = generated_signature === razorpay_signature;
        
        if (isSignatureValid) {
            // Payment is successful, update your database accordingly
            const insertQuery = `INSERT INTO razor_payments_print (razorpay_order_id, razorpay_payment_id, razorpay_signature) VALUES ($1, $2, $3)`;
            await db.query(insertQuery, [razorpay_order_id, razorpay_payment_id, razorpay_signature]);
            const query = `UPDATE prints SET payment_status = $1 WHERE rp_id = $2`;
            await db.query(query, ["paid", razorpay_order_id]);
            const userQuery = `SELECT user_id FROM prints WHERE rp_id = $1`;
            const { rows: userRows } = await db.query(userQuery, [razorpay_order_id]);
            if (userRows.length === 0) {
                return res.status(404).json({ message: "Print not found" });
            }
            const userId = userRows[0].user_id;
            const emailQuery = `SELECT email FROM users WHERE id = $1`;
            const { rows: emailRows } = await db.query(emailQuery, [userId]);
            if (emailRows.length === 0) {
                return res.status(404).json({ message: "User email not found" });
            }
            const printDetailsQuery = `
                SELECT id, copies, print_type, print_side, description, created_at
                FROM prints
                WHERE rp_id = $1`;
            const { rows } = await db.query(printDetailsQuery, [razorpay_order_id]);
            if (rows.length === 0) {
                return res.status(404).json({ message: "Print details not found" });
            }
            const { copies, print_type: printType, print_side: printSide, description } = rows[0];
            const userEmail = emailRows[0].email;
            const subject = "Print Order Confirmation";
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
                console.log("Failed to send email notification");
            }
            res.redirect(`${process.env.CLIENT_URL}/payment-success?order_id=${razorpay_order_id}`);
        }
        else {
            res.status(400).json({ message: "Payment verification failed", success: false });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message, success: false });
        console.log(error);
    }
}
module.exports = {
    paymentVerify,
    paymentVerifyPrint
}