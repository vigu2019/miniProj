const cors = require('cors')
const express = require('express');
const {app,server} = require('./socket/socket');
const userRoutes = require('./routes/user.routes');
const printRoutes= require("./routes/print.route");
const morgan = require('morgan');
require('dotenv').config()
const db=require('./utils/db')
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.CLIENT_URL
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/v1/api/user', userRoutes);
app.use('/v1/api/user/print', printRoutes);


server.listen(process.env.PORT, () => {
    // connectDB()
    console.log(`Server is listening on port ${process.env.PORT}`);
});