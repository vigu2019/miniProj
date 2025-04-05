const db = require('../utils/db');
const getAllOrders = async (req, res) => {
    try {
        // Modified query to get all orders without filtering by user_id
        const ordersQuery = `
            SELECT o.id, o.order_date, o.status, o.total, o.created_at, u.fullname as customer_name, o.user_id
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
            status: order.status.toLowerCase()
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
        const query = `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`;
        const { rows } = await db.query(query, [status, orderId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' ,success: false });
        }
        return res.status(200).json({ message: 'Order status updated successfully', order: rows[0] ,success: true });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {getAllOrders, updateStatus};