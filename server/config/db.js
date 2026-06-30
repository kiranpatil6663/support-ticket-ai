import pg from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const { Pool } = pg

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

const connectDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS tickets (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                customer_name VARCHAR(100) NOT NULL,
                customer_email VARCHAR(150) NOT NULL,
                category VARCHAR(50) DEFAULT NULL,
                priority VARCHAR(20) DEFAULT NULL,
                summary TEXT DEFAULT NULL,
                status VARCHAR(30) DEFAULT 'Open',
                assigned_to INTEGER REFERENCES users(id) DEFAULT NULL,
                created_by INTEGER REFERENCES users(id) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        const { rows: userRows } = await pool.query('SELECT COUNT(*) as count FROM users')
        if (parseInt(userRows[0].count) === 0) {
            await seedUsers()
        }

        const { rows: ticketRows } = await pool.query('SELECT COUNT(*) as count FROM tickets')
        if (parseInt(ticketRows[0].count) === 0) {
            await seedTickets()
        }

        console.log('PostgreSQL connected successfully')
    } catch (error) {
        console.log('DB Connection Error:', error.message)
        process.exit(1)
    }
}

const seedUsers = async () => {
    const password = await bcrypt.hash('password123', 10)

    const users = [
        ['John Customer', 'user@demo.com', password, 'user'],
        ['Sarah Manager', 'manager@demo.com', password, 'manager'],
        ['Dev One', 'dev1@demo.com', password, 'developer'],
        ['Dev Two', 'dev2@demo.com', password, 'developer'],
    ]

    for (const user of users) {
        await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
            user
        )
    }
    console.log('Users seeded')
}

const seedTickets = async () => {
    const { rows } = await pool.query("SELECT id FROM users WHERE role = 'user' LIMIT 1")
    const userId = rows[0]?.id || null

    const insertQuery = `
        INSERT INTO tickets (title, description, customer_name, customer_email, category, priority, summary, status, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `

    const tickets = [
        ['Cannot login to my account', 'I have been trying to login since yesterday but keep getting invalid credentials error even after resetting my password twice.', 'John Smith', 'john@example.com', 'Account', 'High', 'User cannot login despite multiple password resets. Possible account lock or auth system issue.', 'Open', userId],
        ['Wrong amount charged on invoice #4521', 'My invoice shows $299 but I am on the $99 plan. I need a refund of $200 immediately.', 'Sarah Lee', 'sarah@example.com', 'Billing', 'High', 'Customer was overcharged by $200 on invoice #4521 and is requesting an immediate refund.', 'Open', userId],
        ['App crashes when uploading files over 5MB', 'Every time I try to upload a PDF larger than 5MB the app completely freezes. Tested on Chrome and Firefox both.', 'Mike Johnson', 'mike@example.com', 'Technical', 'Medium', 'Application crashes during file uploads exceeding 5MB across multiple browsers.', 'In Progress', userId],
        ['How do I export my project data as CSV?', 'I want to export all my project records as a CSV file but cannot find this option anywhere in settings.', 'Priya Patel', 'priya@example.com', 'General', 'Low', 'User is looking for a data export feature that may exist but is difficult to discover in the UI.', 'Resolved', userId],
        ['SMS OTP codes are not working', 'The one-time password I receive via SMS never works. I have tried 5 times today and each time it says invalid code.', 'Alex Wong', 'alex@example.com', 'Technical', 'High', 'SMS-based OTP verification is consistently failing for the user. Possible SMS gateway or token expiry issue.', 'Open', userId],
        ['Need team pricing for 15 members', 'We are a team of 15 people and looking to sign up annually. Do you offer any team or volume discounts?', 'Emma Davis', 'emma@example.com', 'Billing', 'Low', 'Sales inquiry from a prospective team customer asking about annual billing discounts for 15 users.', 'Open', userId],
    ]

    for (const ticket of tickets) {
        await pool.query(insertQuery, ticket)
    }
    console.log('Tickets seeded')
}

export { pool, connectDB }