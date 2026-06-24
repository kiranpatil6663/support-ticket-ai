import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { AppContext } from "../context/AppContext"
import PriorityBadge from "../components/PriorityBadge"
import CategoryBadge from "../components/CategoryBadge"

const TicketDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { backendUrl, getAllTickets } = useContext(AppContext)

    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updatingStatus, setUpdatingStatus] = useState(false)

    const fetchTicket = async () => {
        try {
            const { data } = await axios.get(backendUrl + `/api/ticket/${id}`)
            if (data.success) {
                setTicket(data.ticket)
            } else {
                toast.error(data.message)
                navigate('/tickets')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (newStatus) => {
        try {
            setUpdatingStatus(true)
            const { data } = await axios.post(backendUrl + `/api/ticket/status/${id}`, { status: newStatus })
            if (data.success) {
                setTicket({ ...ticket, status: newStatus })
                await getAllTickets()
                toast.success('Status updated')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setUpdatingStatus(false)
        }
    }

    useEffect(() => {
        fetchTicket()
    }, [id])

    if (loading) {
        return <div className="text-center py-20 text-gray-400">Loading ticket...</div>
    }

    if (!ticket) return null

    return (
        <div className="max-w-3xl mx-auto px-6 py-8">
            <button
                onClick={() => navigate('/tickets')}
                className="text-sm text-blue-600 hover:underline mb-6 block"
            >
                ← Back to all tickets
            </button>

            {/* Main ticket info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{ticket.title}</h2>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <CategoryBadge category={ticket.category} />
                        <PriorityBadge priority={ticket.priority} />
                    </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-5">{ticket.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-100 pt-4">
                    <span>{ticket.customer_name}</span>
                    <span>{ticket.customer_email}</span>
                    <span>{new Date(ticket.created_at).toLocaleString()}</span>
                </div>
            </div>

            {/* AI Analysis card */}
            {ticket.summary ? (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-4">
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-2">
                        AI Analysis
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{ticket.summary}</p>
                </div>
            ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4 text-center">
                    <p className="text-sm text-gray-400">AI analysis not available for this ticket</p>
                </div>
            )}

            {/* Status controls */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-sm font-medium text-gray-700 mb-3">Update Status</p>
                <div className="flex gap-2">
                    {['Open', 'In Progress', 'Resolved'].map(status => (
                        <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            disabled={updatingStatus || ticket.status === status}
                            className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors
                                ${ticket.status === status
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                                } disabled:opacity-50`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TicketDetail