import express from 'express'
import { getTickets, getTicket, createNewTicket, changeStatus, searchTickets } from '../controllers/ticketController.js'

const ticketRouter = express.Router()

ticketRouter.get('/list', getTickets)
ticketRouter.get('/search', searchTickets)      // ← add this line
ticketRouter.get('/:id', getTicket)
ticketRouter.post('/create', createNewTicket)
ticketRouter.post('/status/:id', changeStatus)

export default ticketRouter