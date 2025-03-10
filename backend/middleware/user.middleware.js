const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    try {
        const token = req.header("Authorization").split(" ")[1];
        // console.log(token)
        if (!token) {
            return res.status(401).json({ error: "Access denied" });
        }
        // console.log(process.env.JWT_SECRET)
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(verified);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
}

module.exports = verifyToken;