import React, { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"
import TicketCard from "../components/TicketCard"

const TicketList = () => {
    const { tickets, loading } = useContext(AppContext)
    const [filterStatus, setFilterStatus] = useState('All')
    const [filterPriority, setFilterPriority] = useState('All')

    const filtered = tickets.filter(ticket => {
        const statusMatch = filterStatus === 'All' || ticket.status === filterStatus
        const priorityMatch = filterPriority === 'All' || ticket.priority === filterPriority
        return statusMatch && priorityMatch
    })

    if (loading) {
        return <div className="text-center py-20 text-gray-400">Loading tickets...</div>
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">All Tickets</h2>
                <p className="text-sm text-gray-500">{filtered.length} results</p>
            </div>

            <div className="flex gap-3 mb-6">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                >
                    <option value="All">All Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>

                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                >
                    <option value="All">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-lg mb-1">No tickets found</p>
                    <p className="text-sm">Try adjusting the filters</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {filtered.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default TicketList