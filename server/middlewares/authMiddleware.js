import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.token

        if (!token) {
            return res.json({ success: false, message: 'Not authorized. Login again.' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const { rows } = await pool.query(
            'SELECT id, name, email, role FROM users WHERE id = $1',
            [decoded.id]
        )

        if (!rows[0]) {
            return res.json({ success: false, message: 'User not found' })
        }

        req.user = rows[0]
        next()

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Invalid token' })
    }
}

const requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.json({ success: false, message: 'Access denied' })
    }
    next()
}

export { authMiddleware, requireRole }