import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { AppContext } from "../context/AppContext"

const CreateTicket = () => {
    const navigate = useNavigate()
    const { backendUrl, getAllTickets, token } = useContext(AppContext)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        customer_name: '',
        customer_email: ''
    })
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.title || !formData.description || !formData.customer_name || !formData.customer_email) {
            return toast.error('All fields are required')
        }

        try {
            setSubmitting(true)
            const { data } = await axios.post(
                backendUrl + '/api/ticket/create',
                formData,
                { headers: { token } }   // ← this was missing
            )

            if (data.success) {
                toast.success('Ticket submitted and analyzed by AI!')
                await getAllTickets()
                navigate(`/tickets/${data.ticket.id}`)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Submit a Support Ticket</h2>
            <p className="text-gray-500 text-sm mb-8">
                Our AI will automatically categorize and prioritize your issue.
            </p>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        name="customer_email"
                        value={formData.customer_email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Brief description of the problem"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Please describe your issue in detail..."
                        rows={5}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Submitting & Analyzing with AI...' : 'Submit Ticket'}
                </button>
            </div>
        </div>
    )
}

export default CreateTicket