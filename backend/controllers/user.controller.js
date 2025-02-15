const db = require("../utils/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require('validator');

const register = async (req, res) => {
    try {
        const {username , email, fullname, password} = req.body;
        if (!username || !email || !fullname || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }
        const user = await db.query("SELECT * FROM users WHERE email = $1", [
        email
        ]);
        if (user.rows.length) {
        return res.status(400).json({ error: "User already exists" });
        }
        const usernameCheck = await db.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
        );
        if (usernameCheck.rows.length) {
        return res.status(400).json({ error: "Username already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.query(
        "INSERT INTO users (username, email, fullname, password) VALUES ($1, $2, $3, $4) RETURNING username, id",
        [username, email, fullname, hashedPassword]
        );
        res.json({ message: `User ${newUser.rows[0].username} registered with id ${newUser.rows[0].id}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // console.log(req.body);
        if (!username || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = await db.query("SELECT * FROM users WHERE username = $1", [
            username
        ]);
        if (!user.rows.length) {
            return res.status(400).json({ error: "Invalid credentials or user does not exist" });
        }
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET,
            { expiresIn: "1d" });
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.rows[0].id,
                username: user.rows[0].username,
                email: user.rows[0].email,
                fullname: user.rows[0].fullname
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}
const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.json({ message: "Logged out" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}
const updatePassword = async (req,res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = await db.query("SELECT * FROM users WHERE id = $1", [
            req.user.id
        ]);
        const validPassword = await bcrypt.compare(oldPassword, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await db.query("UPDATE users SET password = $1 WHERE id = $2", [
            hashedPassword,
            req.user.id
        ]);
        res.json({ message: "Password updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}

const updateProfile = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }
        const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [
            email
        ]);
        if (existingUser.rows.length) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const user = await db.query("SELECT * FROM users WHERE id = $1", [
            req.user.id
        ]);
        if (!user.rows.length) {
            return res.status(400).json({ error: "User does not exist" });
        }
        await db.query("UPDATE users SET email = $1 WHERE id = $2", [
            email,
            req.user.id
        ]);
        res.json({ message: "Profile updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}
module.exports = {
    register,
    login,
    logout,
    updatePassword,
    updateProfile
}