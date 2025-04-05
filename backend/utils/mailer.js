// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log("Mailer is running...")

const transporter = nodemailer.createTransport({
    secure: true,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
const sendEmail = async (to, subject, text) => {
    try{
        await transporter.sendMail({ // Add sender name
            to,
            subject,
            html: text,
            from: {
                name: process.env.MAIL_NAME,
                address: process.env.MAIL_USER,
            },
        });
        console.log('Email sent successfully to:', to);
        return true;
    }
    catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}
module.exports = { transporter, sendEmail };