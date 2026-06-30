import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import ticketRouter from './routes/ticketRoute.js'
import authRouter from './routes/authRoute.js'

const app = express()
const port = process.env.PORT || 4000

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/ticket', ticketRouter)

app.get('/', (req, res) => {
    res.send('API WORKING')
})

app.listen(port, () => console.log('Server started on port', port))