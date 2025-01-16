const cors = require('cors')
const {app,server} = require('./socket/socket');
const morgan = require('morgan');
app.use(morgan('dev'));
require('dotenv').config()

app.use(cors({
    origin: process.env.CLIENT_URL
}))

server.listen(process.env.PORT, () => {
    // connectDB()
    console.log(`Server is listening on port ${process.env.PORT}`);
});