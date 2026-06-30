import {
    getAllTickets, getTicketsByUser, getTicketsByDeveloper,
    getTicketById, createTicket, updateTicketAI,
    updateTicketStatus, assignTicket, getDevelopers, searchTicketsInDB
} from '../models/ticketModel.js'
import { analyzeTicket } from '../services/aiService.js'

const getTickets = async (req, res) => {
    try {
        const { role, id } = req.user
        let tickets

        if (role === 'user') {
            tickets = await getTicketsByUser(id)
        } else if (role === 'developer') {
            tickets = await getTicketsByDeveloper(id)
        } else {
            tickets = await getAllTickets()
        }

        res.json({ success: true, tickets })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getTicket = async (req, res) => {
    try {
        const ticket = await getTicketById(req.params.id)
        if (!ticket) {
            return res.json({ success: false, message: 'Ticket not found' })
        }
        res.json({ success: true, ticket })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const createNewTicket = async (req, res) => {
    try {
        const { title, description, customer_name, customer_email } = req.body

        if (!title || !description || !customer_name || !customer_email) {
            return res.json({ success: false, message: 'All fields are required' })
        }

        const ticketId = await createTicket({
            title, description, customer_name,
            customer_email, created_by: req.user.id
        })

        try {
            const aiResult = await analyzeTicket(title, description)
            await updateTicketAI(ticketId, aiResult)
        } catch (aiError) {
            console.log('AI analysis failed:', aiError.message)
        }

        const ticket = await getTicketById(ticketId)
        res.json({ success: true, message: 'Ticket created successfully', ticket })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const changeStatus = async (req, res) => {
    try {
        const { status } = req.body
        const validStatuses = ['Open', 'In Progress', 'Resolved']

        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: 'Invalid status value' })
        }

        const ticket = await getTicketById(req.params.id)
        if (!ticket) {
            return res.json({ success: false, message: 'Ticket not found' })
        }

        await updateTicketStatus(req.params.id, status)
        res.json({ success: true, message: 'Status updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const assignTicketTodev = async (req, res) => {
    try {
        const { developerId } = req.body

        if (!developerId) {
            return res.json({ success: false, message: 'Developer ID is required' })
        }

        const ticket = await getTicketById(req.params.id)
        if (!ticket) {
            return res.json({ success: false, message: 'Ticket not found' })
        }

        await assignTicket(req.params.id, developerId)
        res.json({ success: true, message: 'Ticket assigned successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getDevList = async (req, res) => {
    try {
        const developers = await getDevelopers()
        res.json({ success: true, developers })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const searchTickets = async (req, res) => {
    try {
        const q = req.query.q
        if (!q || q.trim() === '') {
            return res.json({ success: false, message: 'Search query is required' })
        }
        const tickets = await searchTicketsInDB(q.trim())
        res.json({ success: true, tickets })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { getTickets, getTicket, createNewTicket, changeStatus, assignTicketTodev, getDevList, searchTickets }