const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).json({ error: "Access denied" });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log(verified)
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
}

module.exports = verifyToken;