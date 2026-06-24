import React from "react"
import { useNavigate } from "react-router-dom"
import PriorityBadge from "./PriorityBadge"
import CategoryBadge from "./CategoryBadge"

const TicketCard = ({ ticket }) => {
    const navigate = useNavigate()

    const statusColors = {
        'Open': 'bg-blue-50 text-blue-600',
        'In Progress': 'bg-yellow-50 text-yellow-600',
        'Resolved': 'bg-green-50 text-green-600',
    }

    return (
        <div
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-gray-800 text-sm leading-snug">{ticket.title}</h3>
                <PriorityBadge priority={ticket.priority} />
            </div>

            <div className="flex items-center gap-2 mb-3">
                <CategoryBadge category={ticket.category} />
                <span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[ticket.status] || statusColors['Open']}`}>
                    {ticket.status}
                </span>
            </div>

            <p className="text-xs text-gray-400">
                {ticket.customer_name} · {new Date(ticket.created_at).toLocaleDateString()}
            </p>
        </div>
    )
}

export default TicketCard