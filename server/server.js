import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import ticketRouter from './routes/ticketRoute.js'

// App config
const app = express()
const port = process.env.PORT || 4000

connectDB()

// Middlewares
app.use(cors())
app.use(express.json())

// API Endpoints
app.use('/api/ticket', ticketRouter)
// localhost:4000/api/ticket/list
// localhost:4000/api/ticket/create
// localhost:4000/api/ticket/:id

app.get('/', (req, res) => {
    res.send('API WORKING')
})

app.listen(port, () => console.log('Server started on port', port))