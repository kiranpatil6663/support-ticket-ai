import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ success: false, message: 'Email and password are required' })
        }

        const { rows } = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        const user = rows[0]
        if (!user) {
            return res.json({ success: false, message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid credentials' })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getMe = async (req, res) => {
    try {
        res.json({ success: true, user: req.user })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { login, getMe }