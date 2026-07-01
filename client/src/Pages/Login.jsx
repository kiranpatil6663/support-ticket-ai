import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { AppContext } from "../context/AppContext"

const Login = () => {
    const navigate = useNavigate()
    const { backendUrl, setToken, setUser } = useContext(AppContext)

    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const { data } = await axios.post(backendUrl + '/api/auth/login', formData)

            if (data.success) {
                localStorage.setItem('token', data.token)
                setToken(data.token)
                setUser(data.user)
                toast.success(`Welcome back, ${data.user.name}!`)
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const fillDemo = (email) => {
        setFormData({ email, password: 'password123' })
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Support Desk <span className="text-blue-600">AI</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
                        Demo Accounts — Click to fill
                    </p>
                    <div className="grid gap-2">
                        {[
                            { label: 'Customer', email: 'user@demo.com', desc: 'Submit & view own tickets' },
                            { label: 'Manager', email: 'manager@demo.com', desc: 'View all tickets, assign to developers' },
                            { label: 'Developer 1', email: 'dev1@demo.com', desc: 'View & update assigned tickets' },
                            { label: 'Developer 2', email: 'dev2@demo.com', desc: 'View & update assigned tickets' },
                        ].map(account => (
                            <button
                                key={account.email}
                                onClick={() => fillDemo(account.email)}
                                className="text-left px-3 py-2 rounded-lg bg-white border border-blue-100 hover:border-blue-300 transition-colors"
                            >
                                <span className="text-sm font-medium text-gray-800">{account.label}</span>
                                <span className="text-xs text-gray-400 ml-2">{account.email}</span>
                                <p className="text-xs text-gray-400 mt-0.5">{account.desc}</p>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">All passwords: password123</p>
                </div>
            </div>
        </div>
    )
}

export default Login