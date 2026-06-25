import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext"

const Home = () => {
    const navigate = useNavigate()
    const { tickets, loading } = useContext(AppContext)

    const openCount = tickets.filter(t => t.status === 'Open').length
    const highPriorityCount = tickets.filter(t => t.priority === 'High').length
    const resolvedCount = tickets.filter(t => t.status === 'Resolved').length

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Support Desk <span className="text-blue-600">AI</span>
                </h1>
                <p className="text-gray-500 text-sm">
                    Every ticket is automatically categorized, prioritized, and summarized by AI the moment it is submitted.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
                <div
                    onClick={() => navigate('/tickets?status=Open')}
                    className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
                >
                    <p className="text-2xl font-bold text-blue-600">
                        {loading ? '...' : openCount}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Open Tickets</p>
                    <p className="text-xs text-blue-400 mt-1">Click to view →</p>
                </div>

                <div
                    onClick={() => navigate('/tickets?priority=High')}
                    className="bg-red-50 border border-red-100 rounded-lg p-4 text-center cursor-pointer hover:shadow-md hover:border-red-300 transition-all"
                >
                    <p className="text-2xl font-bold text-red-600">
                        {loading ? '...' : highPriorityCount}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">High Priority</p>
                    <p className="text-xs text-red-400 mt-1">Click to view →</p>
                </div>

                <div
                    onClick={() => navigate('/tickets?status=Resolved')}
                    className="bg-green-50 border border-green-100 rounded-lg p-4 text-center cursor-pointer hover:shadow-md hover:border-green-300 transition-all"
                >
                    <p className="text-2xl font-bold text-green-600">
                        {loading ? '...' : resolvedCount}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Resolved</p>
                    <p className="text-xs text-green-400 mt-1">Click to view →</p>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => navigate("/create")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Submit New Ticket
                </button>
                <button
                    onClick={() => navigate("/tickets")}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                    View All Tickets
                </button>
            </div>
        </div>
    )
}

export default Home