const db = require('../utils/db')
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
    // const { printId, status } = req.body;
    console.log(printId, status)
    try {
        const query = `UPDATE prints SET status = $1 WHERE id = $2 RETURNING *`;
        const { rows } = await db.query(query, [status, printId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Print not found', success: false });
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