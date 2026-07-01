import React, { useState, useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext"

const Navbar = () => {
    const navigate = useNavigate()
    const { user, logout } = useContext(AppContext)
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
        setMenuOpen(false)
    }

    const roleColors = {
        user: 'bg-green-100 text-green-700',
        manager: 'bg-purple-100 text-purple-700',
        developer: 'bg-blue-100 text-blue-700',
    }

    return (
        <div className="bg-blue-600 text-white text-sm mb-5 border-b border-b-blue-500">
            <div className="flex items-center justify-between py-4 px-6">
                <p
                    className="text-xl font-bold cursor-pointer"
                    onClick={() => { navigate("/"); setMenuOpen(false) }}
                >
                    SupportDesk AI
                </p>

                {user && (
                    <ul className="hidden md:flex items-center gap-6 font-medium">
                        <NavLink to="/" className={({ isActive }) => isActive ? "underline underline-offset-4" : "hover:underline"}>
                            <li>Home</li>
                        </NavLink>
                        <NavLink to="/tickets" className={({ isActive }) => isActive ? "underline underline-offset-4" : "hover:underline"}>
                            <li>{user.role === 'user' ? 'My Tickets' : 'All Tickets'}</li>
                        </NavLink>
                        {user.role === 'user' && (
                            <NavLink to="/create" className={({ isActive }) => isActive ? "underline underline-offset-4" : "hover:underline"}>
                                <li>New Ticket</li>
                            </NavLink>
                        )}
                    </ul>
                )}

                <div className="hidden md:flex items-center gap-3">
                    {user && (
                        <>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleColors[user.role]}`}>
                                {user.role}
                            </span>
                            <span className="text-sm text-blue-100">{user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-white text-blue-600 font-medium py-1.5 px-3 rounded hover:bg-blue-50 transition-colors text-xs"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-1"
                >
                    <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            {menuOpen && user && (
                <div className="md:hidden bg-blue-700 px-6 py-4 flex flex-col gap-3">
                    <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/tickets" onClick={() => setMenuOpen(false)}>
                        {user.role === 'user' ? 'My Tickets' : 'All Tickets'}
                    </NavLink>
                    {user.role === 'user' && (
                        <NavLink to="/create" onClick={() => setMenuOpen(false)}>New Ticket</NavLink>
                    )}
                    <div className="border-t border-blue-600 pt-3">
                        <p className="text-xs text-blue-200 mb-2">{user.name} · {user.role}</p>
                        <button onClick={handleLogout} className="text-sm text-white hover:underline">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar