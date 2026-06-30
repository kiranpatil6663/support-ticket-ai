import express from 'express'
import {
    getTickets, getTicket, createNewTicket,
    changeStatus, assignTicketTodev, getDevList, searchTickets
} from '../controllers/ticketController.js'
import { authMiddleware, requireRole } from '../middlewares/authMiddleware.js'

const ticketRouter = express.Router()

ticketRouter.use(authMiddleware)

ticketRouter.get('/list', getTickets)
ticketRouter.get('/search', searchTickets)
ticketRouter.get('/developers', requireRole('manager'), getDevList)
ticketRouter.get('/:id', getTicket)
ticketRouter.post('/create', requireRole('user'), createNewTicket)
ticketRouter.post('/status/:id', requireRole('manager', 'developer'), changeStatus)
ticketRouter.post('/assign/:id', requireRole('manager'), assignTicketTodev)

export default ticketRouter