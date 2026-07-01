import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [user, setUser] = useState(null)

    const getAllTickets = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(backendUrl + '/api/ticket/list', {
                headers: { token }
            })
            if (data.success) {
                setTickets(data.tickets)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const loadUser = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/me', {
                headers: { token }
            })
            if (data.success) {
                setUser(data.user)
            } else {
                logout()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        setTickets([])
        localStorage.removeItem('token')
    }

    useEffect(() => {
        if (token) {
            loadUser()
            getAllTickets()
        }
    }, [token])

    const value = {
        backendUrl,
        tickets,
        loading,
        token,
        setToken,
        user,
        setUser,
        getAllTickets,
        logout
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider