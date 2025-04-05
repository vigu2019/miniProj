const cors = require('cors')
const express = require('express');
const {app,server} = require('./socket/socket');
const userRoutes = require('./routes/user.routes');
const printRoutes= require("./routes/print.routes");
const storeRoutes = require('./routes/store.routes');
const storeStaffRoutes = require("./routes/store.staff.routes")
const printStaffRoutes = require("./routes/print.staff.routes")
const morgan = require('morgan');
require('dotenv').config()
// const db=require('./utils/db')
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
console.log(process.env.CLIENT_URL)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/v1/api/user', userRoutes);
app.use('/v1/api/user/print', printRoutes);
app.use('/v1/api/store', storeRoutes);
app.use('/v1/api/store-staff',storeStaffRoutes);
app.use('/v1/api/print-staff',printStaffRoutes);


server.listen(process.env.PORT, () => {
    // connectDB()
    console.log(`Server is listening on port ${process.env.PORT}`);
});