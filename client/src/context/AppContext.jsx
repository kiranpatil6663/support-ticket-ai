import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(false)

    const getAllTickets = async (retryCount = 0) => {
        try {
            setLoading(true)
            const { data } = await axios.get(backendUrl + '/api/ticket/list', {
                timeout: 30000  // wait up to 30 seconds for Render to wake up
            })
            if (data.success) {
                setTickets(data.tickets)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            // If request failed and we haven't retried yet — try once more
            // Handles Render cold start timeout
            if (retryCount === 0) {
                console.log('Retrying after backend wake up...')
                setTimeout(() => getAllTickets(1), 3000)  // retry after 3 seconds
            } else {
                toast.error('Could not connect to server. Please refresh.')
            }
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