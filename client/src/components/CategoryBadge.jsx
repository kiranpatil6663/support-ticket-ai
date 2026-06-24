import React from "react"

const CategoryBadge = ({ category }) => {
    const styles = {
        Billing: "bg-purple-100 text-purple-700",
        Technical: "bg-blue-100 text-blue-700",
        Account: "bg-orange-100 text-orange-700",
        General: "bg-gray-100 text-gray-600",
    }

    if (!category) {
        return <span className="bg-gray-100 text-gray-400 text-xs px-2 py-1 rounded">Uncategorized</span>
    }

    return (
        <span className={`text-xs px-2 py-1 rounded font-medium ${styles[category] || styles.General}`}>
            {category}
        </span>
    )
}

export default CategoryBadge