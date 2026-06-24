import React from "react"
import { NavLink, useNavigate } from "react-router-dom"

const Navbar = () => {
    const navigate = useNavigate()

    return (
        <div className="bg-blue-600 text-white flex items-center justify-between text-sm py-4 mb-5 border-b border-b-blue-500 px-6">
            <p className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
                SupportDesk AI
            </p>

            <ul className="hidden md:flex items-center gap-6 font-medium">
                <NavLink to="/" className={({ isActive }) => isActive ? "underline underline-offset-4" : "hover:underline"}>
                    <li>Home</li>
                </NavLink>
                <NavLink to="/tickets" className={({ isActive }) => isActive ? "underline underline-offset-4" : "hover:underline"}>
                    <li>All Tickets</li>
                </NavLink>
            </ul>

            <button
                onClick={() => navigate("/create")}
                className="bg-white text-blue-600 font-medium py-2 px-4 rounded hover:bg-blue-50 transition-colors"
            >
                + New Ticket
            </button>
        </div>
    )
}

export default Navbar