const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors({
    origin: process.env.CLIENT_URL
}))


app.listen(process.env.PORT||3000,() => {
    console.log(`server is up at ${process.env.PORT}`)
})