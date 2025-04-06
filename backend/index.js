const cors = require('cors');
const express = require('express');
const {app, server} = require('./socket/socket');
const userRoutes = require('./routes/user.routes');
const printRoutes = require("./routes/print.routes");
const storeRoutes = require('./routes/store.routes');
const storeStaffRoutes = require("./routes/store.staff.routes");
const printStaffRoutes = require("./routes/print.staff.routes");
const paymentRoutes = require('./routes/payment.routes');
const paymentPrintRoutes = require('./routes/payment.print.routes');
const morgan = require('morgan');
const { transporter } = require('./utils/mailer');  

require('dotenv').config();

app.use(morgan('dev'));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/v1/api/user', userRoutes);
app.use('/v1/api/user/print', printRoutes);
app.use('/v1/api/store', storeRoutes);
app.use('/v1/api/store-staff', storeStaffRoutes);
app.use('/v1/api/print-staff', printStaffRoutes);
app.use('/v1/api/store/payment', paymentRoutes);
app.use('/v1/api/print/payment', paymentPrintRoutes);

// Start server
server.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
    try {
        transporter.verify(function(error, success) {
            if (error) {
                console.error('Email verification failed:', error);
            } else {
                console.log('Email server is ready to accept messages');
            }
        });
    } catch (err) {
        console.error('Error with email transporter:', err);
    }
});