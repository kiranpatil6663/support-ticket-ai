import React from "react"

const PriorityBadge = ({ priority }) => {
    const styles = {
        High: "bg-red-100 text-red-700 border border-red-200",
        Medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
        Low: "bg-green-100 text-green-700 border border-green-200",
    }

    if (!priority) {
        return <span className="bg-gray-100 text-gray-400 text-xs px-2 py-1 rounded-full">Analyzing...</span>
    }

    return (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[priority] || styles.Low}`}>
            {priority} Priority
        </span>
    )
}

export default PriorityBadge