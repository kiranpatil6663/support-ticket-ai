import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

// Pool = multiple reusable connections, not one connection per request
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }  
})

// This runs once on startup — creates table if it doesn't exist, then seeds
const connectDB = async () => {
    try {
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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)

        // Seed only if table is empty
        const { rows } = await pool.query('SELECT COUNT(*) as count FROM tickets')
        if (parseInt(rows[0].count) === 0) {
            await seedTickets()
        }

        console.log('PostgreSQL connected successfully')
    } catch (error) {
        console.log('DB Connection Error:', error.message)
        process.exit(1) // Stop server if DB fails — no point running without it
    }
}

const seedTickets = async () => {
    const insertQuery = `
        INSERT INTO tickets (title, description, customer_name, customer_email, category, priority, summary, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `

    const tickets = [
        ['Cannot login to my account', 'I have been trying to login since yesterday but keep getting invalid credentials error even after resetting my password twice.', 'John Smith', 'john@example.com', 'Account', 'High', 'User cannot login despite multiple password resets. Possible account lock or auth system issue.', 'Open'],
        ['Wrong amount charged on invoice #4521', 'My invoice shows $299 but I am on the $99 plan. I need a refund of $200 immediately.', 'Sarah Lee', 'sarah@example.com', 'Billing', 'High', 'Customer was overcharged by $200 on invoice #4521 and is requesting an immediate refund.', 'Open'],
        ['App crashes when uploading files over 5MB', 'Every time I try to upload a PDF larger than 5MB the app completely freezes. Tested on Chrome and Firefox both.', 'Mike Johnson', 'mike@example.com', 'Technical', 'Medium', 'Application crashes during file uploads exceeding 5MB across multiple browsers. Likely a file size limit bug.', 'In Progress'],
        ['How do I export my project data as CSV?', 'I want to export all my project records as a CSV file but cannot find this option anywhere in the settings.', 'Priya Patel', 'priya@example.com', 'General', 'Low', 'User is looking for a data export feature that may exist but is difficult to discover in the UI.', 'Resolved'],
        ['SMS OTP codes are not working', 'The one-time password I receive via SMS never works. I have tried 5 times today and each time it says the code is invalid.', 'Alex Wong', 'alex@example.com', 'Technical', 'High', 'SMS-based OTP verification is consistently failing for the user. Possible SMS gateway or token expiry issue.', 'Open'],
        ['Need team pricing for 15 members', 'We are a team of 15 people and looking to sign up annually. Do you offer any team or volume discounts?', 'Emma Davis', 'emma@example.com', 'Billing', 'Low', 'Sales inquiry from a prospective team customer asking about annual billing discounts for 15 users.', 'Open'],
    ]

    for (const ticket of tickets) {
        await pool.query(insertQuery, ticket)
    }

    console.log('Database seeded with sample tickets')
}

export { pool, connectDB }