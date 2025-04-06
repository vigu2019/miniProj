const db = require("../utils/db");
const instance = require("../utils/razorpay");

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
//integrate razorpay 
const addToOrder = async (req, res) => {
    try {
        const { items, total } = req.body;
        const user_id = req.user.id;
        
        if (!items || !total) {
            return res.status(400).json({ error: "All fields are required" });
        }
        
        const query = `INSERT INTO orders (user_id, total, status)
            VALUES ($1, $2, $3)
            RETURNING id, user_id, order_date, status, total`;
                
        const values = [user_id, total, "pending"];
        const { rows } = await db.query(query, values);
        const order_id = rows[0].id;
        
        // Create Razorpay order
        const razorpayOrder = await instance.orders.create({
            amount: total * 100, // Amount in paise
            currency: "INR",
            receipt: order_id.toString(),
        });
        
        if (!razorpayOrder) {
            return res.status(500).json({ message: "Failed to create Razorpay order", success: false });
        }
        
        // Save Razorpay order ID in the database
        const updateOrderQuery = `UPDATE orders SET rp_id = $1 WHERE id = $2`;
        await db.query(updateOrderQuery, [razorpayOrder.id, order_id]);
        
        for (const item of items) {
            const query = `INSERT INTO order_items (order_id, item_id, name, price, quantity, category) values ($1, $2, $3, $4, $5, $6)`;
            const values = [order_id, item.id, item.name, item.price, item.quantity, item.category];
            await db.query(query, values);
        }
        
        res.status(200).json({ order: razorpayOrder, success: true ,key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
        console.log(error);
    }
};

module.exports = { addToOrder, getUserOrders };

