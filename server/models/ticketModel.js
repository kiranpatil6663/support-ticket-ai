import { pool } from '../config/db.js'

const getAllTickets = async () => {
    const { rows } = await pool.query(
        'SELECT id, title, customer_name, customer_email, category, priority, status, created_at FROM tickets ORDER BY created_at DESC'
    )
    return rows
}

const getTicketById = async (id) => {
    const { rows } = await pool.query(
        'SELECT * FROM tickets WHERE id = $1',
        [id]
    )
    return rows[0]
}

const createTicket = async ({ title, description, customer_name, customer_email }) => {
    const { rows } = await pool.query(
        `INSERT INTO tickets (title, description, customer_name, customer_email)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [title, description, customer_name, customer_email]
    )
    return rows[0].id
}

const updateTicketAI = async (id, { category, priority, summary }) => {
    await pool.query(
        `UPDATE tickets SET category = $1, priority = $2, summary = $3 WHERE id = $4`,
        [category, priority, summary, id]
    )
}

const updateTicketStatus = async (id, status) => {
    await pool.query(
        'UPDATE tickets SET status = $1 WHERE id = $2',
        [status, id]
    )
}

const searchTicketsInDB = async (query) => {
    const searchTerm = `%${query}%`
    const { rows } = await pool.query(
        `SELECT id, title, customer_name, customer_email, category, priority, status, created_at
         FROM tickets
         WHERE
             title ILIKE $1 OR
             description ILIKE $1 OR
             customer_name ILIKE $1 OR
             customer_email ILIKE $1 OR
             category ILIKE $1
         ORDER BY created_at DESC`,
        [searchTerm]
    )
    return rows
}

export { getAllTickets, getTicketById, createTicket, updateTicketAI, updateTicketStatus, searchTicketsInDB }