const db = require("../utils/db");
const { sendEmail } = require("../utils/mailer");
const addToOrder = async (req, res) => {   
    try{
        const { items, total } = req.body;
        const user_id = req.user.id;
        if (!items || !total) {
            return res.status(400).json({ error: "All fields are required" });
        }
       const query= `INSERT INTO orders (user_id, total, status) 
       VALUES ($1, $2, $3) 
       RETURNING id, user_id, order_date, status, total`;
       const values = [user_id, total, "pending"];
         const { rows } = await db.query(query, values);
            const order_id = rows[0].id;
        for(const item of items){
            const query = `INSERT INTO order_items (order_id, item_id, name, price, quantity, category) values ($1, $2, $3, $4, $5, $6)`;
            const values = [order_id, item.id, item.name, item.price, item.quantity, item.category];
            await db.query(query, values);
        }
        // Send email notification to the user
        const userQuery = `SELECT email FROM users WHERE id = $1`;
        const { rows: userRows } = await db.query(userQuery, [user_id]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const userEmail = userRows[0].email;
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
                        <p><strong>Order ID:</strong> #${order_id}</p>
                        <p><strong>Order Date:</strong> ${new Date(rows[0].order_date).toLocaleDateString()}</p>
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
                            ${items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${item.price.toFixed(2)}</td>
                                    <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                            <tr class="total-row">
                                <td colspan="3" style="text-align: right;">Total:</td>
                                <td>₹${total.toFixed(2)}</td>
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
            return res.status(500).json({ message: "Failed to send email notification" });
        }
        return res.status(201).json({ message: "Order added", data: rows[0] });
    }
    catch(error){
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}
const getUserOrders = async (req, res) => {
    try {
        const user_id = req.user.id;
        
        // First get all the user's orders
        const ordersQuery = `SELECT * FROM orders WHERE user_id = $1`;
        const { rows: orders } = await db.query(ordersQuery, [user_id]);
        
        // If there are no orders, return the empty array
        if (orders.length === 0) {
            return res.status(200).json({ data: [] });
        }
        
        // Extract all order IDs
        const orderIds = orders.map(order => order.id);
        
        // Get all items for these orders in a single query
        const itemsQuery = `
            SELECT * FROM order_items 
            WHERE order_id = ANY($1::int[])
        `;
        const { rows: allItems } = await db.query(itemsQuery, [orderIds]);
        
        // Group items by order_id
        const itemsByOrderId = allItems.reduce((acc, item) => {
            if (!acc[item.order_id]) {
                acc[item.order_id] = [];
            }
            acc[item.order_id].push(item);
            return acc;
        }, {});
        
        // Add items to each order
        const ordersWithItems = orders.map(order => ({
            ...order,
            items: itemsByOrderId[order.id] || []
        }));
        
        return res.status(200).json({ data: ordersWithItems });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}
module.exports = { addToOrder, getUserOrders };

