import React, { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

const Navbar = () => {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div className="bg-blue-600 text-white text-sm mb-5 border-b border-b-blue-500">
            {/* Main navbar row */}
            <div className="flex items-center justify-between py-4 px-6">
                <p
                    className="text-xl font-bold cursor-pointer"
                    onClick={() => { navigate("/"); setMenuOpen(false) }}
                >
                    SupportDesk AI
                </p>

                {/* Desktop nav */}
                <ul className="hidden md:flex items-center gap-6 font-medium">
                    <NavLink to="/" className={({ isActive }) => isActive ? "underline underline-offset-4" : "hover:underline"}>
                        <li>Home</li>
                    </NavLink>
                    <NavLink to="/tickets" className={({ isActive }) => isActive ? "underline underline-offset-4" : "hover:underline"}>
                        <li>All Tickets</li>
                    </NavLink>
                </ul>

                {/* Desktop button */}
                <button
                    onClick={() => navigate("/create")}
                    className="hidden md:block bg-white text-blue-600 font-medium py-2 px-4 rounded hover:bg-blue-50 transition-colors"
                >
                    + New Ticket
                </button>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-1"
                >
                    <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            {/* Mobile menu dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-blue-700 px-6 py-4 flex flex-col gap-4">
                    <NavLink
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) => isActive ? "underline underline-offset-4" : "hover:underline"}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/tickets"
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) => isActive ? "underline underline-offset-4" : "hover:underline"}
                    >
                        All Tickets
                    </NavLink>
                    <button
                        onClick={() => { navigate("/create"); setMenuOpen(false) }}
                        className="bg-white text-blue-600 font-medium py-2 px-4 rounded hover:bg-blue-50 w-full text-left"
                    >
                        + New Ticket
                    </button>
                </div>
            )}
        </div>
    )
}

export default Navbar