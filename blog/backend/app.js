const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const router = require('./routes/user-routes')
const blogRouter = require('./routes/blog-routes.js')

const app = express();

app.use(express.json())

app.use('/api/user', router)
app.use('/api/blog', blogRouter)

mongoose.connect(process.env.MONGO_URL)
     .then(() => { console.log('Connected to database') })
     .catch((err) => { console.log('Error ', err) })

app.listen(5000, () => {
     console.log('Server connected on port 5000')
})