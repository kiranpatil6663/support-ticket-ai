import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(false)

    const getAllTickets = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(backendUrl + '/api/ticket/list')
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

    useEffect(() => {
        getAllTickets()
    }, [])

    const value = {
        backendUrl,
        tickets,
        loading,
        getAllTickets
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider