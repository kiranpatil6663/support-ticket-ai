import React, { useContext, useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import { AppContext } from "../context/AppContext"
import TicketCard from "../components/TicketCard"

const TicketList = () => {
    const { tickets, loading, backendUrl } = useContext(AppContext)
    const [searchParams] = useSearchParams()

    const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'All')
    const [filterPriority, setFilterPriority] = useState(searchParams.get('priority') || 'All')
    const [sortBy, setSortBy] = useState('newest')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [searchActive, setSearchActive] = useState(false)

    useEffect(() => {
        const status = searchParams.get('status')
        const priority = searchParams.get('priority')
        if (status) setFilterStatus(status)
        if (priority) setFilterPriority(priority)
    }, [searchParams])

    // Debounced search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchActive(false)
            setSearchResults([])
            return
        }

        const timer = setTimeout(async () => {
            try {
                setIsSearching(true)
                const { data } = await axios.get(backendUrl + `/api/ticket/search?q=${encodeURIComponent(searchQuery)}`)
                if (data.success) {
                    setSearchResults(data.tickets)
                    setSearchActive(true)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsSearching(false)
            }
        }, 400)

        return () => clearTimeout(timer)
    }, [searchQuery])

    const priorityOrder = { High: 1, Medium: 2, Low: 3 }

    const displayTickets = searchActive
        ? searchResults
        : tickets
            .filter(ticket => {
                const statusMatch = filterStatus === 'All' || ticket.status === filterStatus
                const priorityMatch = filterPriority === 'All' || ticket.priority === filterPriority
                return statusMatch && priorityMatch
            })
            .sort((a, b) => {
                if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at)
                if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at)
                if (sortBy === 'priority') return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4)
                return 0
            })

    if (loading) {
        return <div className="text-center py-20 text-gray-400">Loading tickets...</div>
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">All Tickets</h2>
                <p className="text-sm text-gray-500">{displayTickets.length} results</p>
            </div>

            {/* Search bar */}
            <div className="relative mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, name, email, category..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 pr-20"
                />
                {isSearching && (
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400">
                        Searching...
                    </span>
                )}
                {searchQuery && !isSearching && (
                    <button
                        onClick={() => { setSearchQuery(''); setSearchActive(false) }}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
                    >
                        ✕ Clear
                    </button>
                )}
            </div>

            {/* Filters + Sort — hidden when search active */}
            {!searchActive && (
                <div className="flex flex-wrap gap-3 mb-6">
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

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="priority">Priority (High → Low)</option>
                    </select>

                    {(filterStatus !== 'All' || filterPriority !== 'All') && (
                        <button
                            onClick={() => { setFilterStatus('All'); setFilterPriority('All') }}
                            className="text-sm text-blue-600 hover:underline px-2"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {searchActive && (
                <div className="mb-4">
                    <span className="text-sm text-gray-500">
                        Results for <span className="font-medium text-gray-700">"{searchQuery}"</span>
                    </span>
                </div>
            )}

            {displayTickets.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-lg mb-1">
                        {searchActive ? 'No tickets match your search' : 'No tickets found'}
                    </p>
                    <p className="text-sm">
                        {searchActive ? 'Try different keywords' : 'Try adjusting the filters'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {displayTickets.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default TicketList