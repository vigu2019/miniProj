const db = require('../utils/db');
const {sendEmail} = require('../utils/mailer');

const getAllOrders = async (req, res) => {
    try {
        // Modified query to get all orders without filtering by user_id
        const ordersQuery = `
            SELECT o.id, o.order_date, o.status, o.total, o.created_at, u.fullname as customer_name, o.user_id,o.payment_status
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.order_date DESC
        `;
        const { rows: orders } = await db.query(ordersQuery);

        if (orders.length === 0) {
            return res.status(200).json({ data: [] });
        }

        const orderIds = orders.map(order => order.id);
        const itemsQuery = `
            SELECT order_id, name, price, quantity, category
            FROM order_items
            WHERE order_id = ANY($1::int[])
        `;
        const { rows: allItems } = await db.query(itemsQuery, [orderIds]);

        const itemsByOrderId = allItems.reduce((acc, item) => {
            if (!acc[item.order_id]) {
                acc[item.order_id] = [];
            }
            acc[item.order_id].push({
                name: item.name,
                quantity: item.quantity,
                price: parseFloat(item.price),
                category: item.category
            });
            return acc;
        }, {});

        const ordersWithItems = orders.map(order => ({
            id: order.id,
            date: new Date(order.order_date || order.created_at),
            customer: order.customer_name,
            userId: order.user_id,
            items: itemsByOrderId[order.id] || [],
            total: parseFloat(order.total),
            status: order.status.toLowerCase(),
            paymentStatus: order.payment_status.toLowerCase(),

        }));

        return res.status(200).json({ items: ordersWithItems,success: true });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
};
const updateStatus = async (req, res) => {
    const { orderId, status } = req.body;
    try {
        // Validate status is one of the allowed values
        if (!['pending', 'completed', 'cancelled'].includes(status.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid status value', success: false });
        }
        
        const query = `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`;
        const { rows } = await db.query(query, [status, orderId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Order not found', success: false });
        }
        // console.log('Order status updated:', rows[0]);
        
        // Only send email notification if the status is "completed"
        if (status.toLowerCase() === 'completed') {
            const userId = rows[0].user_id;
            const userQuery = `SELECT email FROM users WHERE id = $1`;
            const { rows: userRows } = await db.query(userQuery, [userId]);
            if (userRows.length === 0) {
                return res.status(404).json({ message: 'User not found', success: false });
            }
            const userEmail = userRows[0].email;
            const subject = 'Order Status Update';
            
            // Get order items for the email
            const itemsQuery = `SELECT * FROM order_items WHERE order_id = $1`;
            const { rows: itemsRows } = await db.query(itemsQuery, [orderId]);
            
            // Set color scheme for completed status
            const statusColor = '#4CAF50'; // Green
            const headerBg = '#4CAF50';
            const headerText = 'Your Order is Complete!';
            
            // Convert total to number before using toFixed
            const orderTotal = parseFloat(rows[0].total) || 0;
            
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
                        background-color: ${headerBg};
                        color: white;
                        padding: 15px;
                        text-align: center;
                        border-radius: 5px 5px 0 0;
                    }
                    .content {
                        padding: 20px 0;
                    }
                    .order-details {
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
                        background-color: ${statusColor};
                        color: white;
                        border-radius: 3px;
                        font-weight: bold;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th, td {
                        padding: 12px 15px;
                        border-bottom: 1px solid #ddd;
                        text-align: left;
                    }
                    th {
                        background-color: #f8f9fa;
                    }
                    .total-row {
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
                        background-color: ${statusColor};
                        color: white;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 4px;
                        font-weight: bold;
                        margin-top: 15px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>${headerText}</h2>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>We're writing to inform you that your order has been completed!</p>
                        
                        <div class="order-details">
                            <h3>Order Details</h3>
                            
                            <div class="detail-row">
                                <div class="detail-label">Order ID:</div>
                                <div>#${orderId}</div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-label">Order Date:</div>
                                <div>${new Date(rows[0].order_date).toLocaleDateString()}</div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-label">Status:</div>
                                <div><span class="status">Completed</span></div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-label">Total:</div>
                                <div>$${orderTotal.toFixed(2)}</div>
                            </div>
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
                                ${itemsRows.map(item => {
                                    // Convert item price to number before using toFixed
                                    const itemPrice = parseFloat(item.price) || 0;
                                    const itemQuantity = parseInt(item.quantity) || 0;
                                    const subtotal = itemPrice * itemQuantity;
                                    
                                    return `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${itemQuantity}</td>
                                        <td>₹${itemPrice.toFixed(2)}</td>
                                        <td>₹${subtotal.toFixed(2)}</td>
                                    </tr>
                                    `;
                                }).join('')}
                                <tr class="total-row">
                                    <td colspan="3" style="text-align: right;">Total:</td>
                                    <td>₹${orderTotal.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <p>Thank you for your purchase! Your order has been completed and is ready for pickup.</p>
                        <p>Please bring your order ID when you come to collect your items.</p>
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
        
        return res.status(200).json({ message: 'Order status updated successfully', order: rows[0], success: true });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {getAllOrders, updateStatus};