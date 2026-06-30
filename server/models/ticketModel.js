import { pool } from '../config/db.js'

const getAllTickets = async () => {
    const { rows } = await pool.query(`
        SELECT
            t.id, t.title, t.customer_name, t.customer_email,
            t.category, t.priority, t.status, t.created_at,
            u.name as assigned_to_name, u.id as assigned_to
        FROM tickets t
        LEFT JOIN users u ON t.assigned_to = u.id
        ORDER BY t.created_at DESC
    `)
    return rows
}

const getTicketsByUser = async (userId) => {
    const { rows } = await pool.query(`
        SELECT
            t.id, t.title, t.customer_name, t.customer_email,
            t.category, t.priority, t.status, t.created_at,
            u.name as assigned_to_name
        FROM tickets t
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE t.created_by = $1
        ORDER BY t.created_at DESC
    `, [userId])
    return rows
}

const getTicketsByDeveloper = async (devId) => {
    const { rows } = await pool.query(`
        SELECT
            t.id, t.title, t.customer_name, t.customer_email,
            t.category, t.priority, t.status, t.created_at,
            u.name as assigned_to_name
        FROM tickets t
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE t.assigned_to = $1
        ORDER BY t.created_at DESC
    `, [devId])
    return rows
}

const getTicketById = async (id) => {
    const { rows } = await pool.query(`
        SELECT
            t.*,
            u.name as assigned_to_name,
            creator.name as created_by_name
        FROM tickets t
        LEFT JOIN users u ON t.assigned_to = u.id
        LEFT JOIN users creator ON t.created_by = creator.id
        WHERE t.id = $1
    `, [id])
    return rows[0]
}

const createTicket = async ({ title, description, customer_name, customer_email, created_by }) => {
    const { rows } = await pool.query(
        `INSERT INTO tickets (title, description, customer_name, customer_email, created_by)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [title, description, customer_name, customer_email, created_by]
    )
    return rows[0].id
}

const updateTicketAI = async (id, { category, priority, summary }) => {
    await pool.query(
        'UPDATE tickets SET category = $1, priority = $2, summary = $3 WHERE id = $4',
        [category, priority, summary, id]
    )
}

const updateTicketStatus = async (id, status) => {
    await pool.query(
        'UPDATE tickets SET status = $1 WHERE id = $2',
        [status, id]
    )
}

const assignTicket = async (ticketId, developerId) => {
    await pool.query(
        'UPDATE tickets SET assigned_to = $1 WHERE id = $2',
        [developerId, ticketId]
    )
}

const getDevelopers = async () => {
    const { rows } = await pool.query(
        "SELECT id, name, email FROM users WHERE role = 'developer' ORDER BY name"
    )
    return rows
}

const searchTicketsInDB = async (query) => {
    const searchTerm = `%${query}%`
    const { rows } = await pool.query(`
        SELECT
            t.id, t.title, t.customer_name, t.customer_email,
            t.category, t.priority, t.status, t.created_at,
            u.name as assigned_to_name
        FROM tickets t
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE
            t.title ILIKE $1 OR
            t.description ILIKE $1 OR
            t.customer_name ILIKE $1 OR
            t.customer_email ILIKE $1 OR
            t.category ILIKE $1
        ORDER BY t.created_at DESC
    `, [searchTerm])
    return rows
}

export {
    getAllTickets, getTicketsByUser, getTicketsByDeveloper,
    getTicketById, createTicket, updateTicketAI,
    updateTicketStatus, assignTicket, getDevelopers, searchTicketsInDB
}