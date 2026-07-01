import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './Pages/Home'
import TicketList from './Pages/TicketList'
import CreateTicket from './Pages/CreateTicket'
import TicketDetail from './Pages/TicketDetail'
import Login from './Pages/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AppContext)
    if (!token) return <Navigate to="/login" replace />
    return children
}

const PublicRoute = ({ children }) => {
    const { token } = useContext(AppContext)
    if (token) return <Navigate to="/" replace />
    return children
}

function App() {
    return (
        <div>
            <ToastContainer />
            <Navbar />
            <Routes>
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/tickets" element={<ProtectedRoute><TicketList /></ProtectedRoute>} />
                <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
                <Route path="/create" element={<ProtectedRoute><CreateTicket /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default App