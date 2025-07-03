import React from 'react'
import {
    Search
} from 'lucide-react';

const Icon = Search;

const Searchbar = ({placeholder, value, onChange, onSubmit, bgClass = 'bg-white'}) => {
    const handleSubmit = (e) => {
        e.preventDefault()
        if (onSubmit) onSubmit(value)
    }

    return (
        <form onSubmit={handleSubmit} className="relative mt-5">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded ${bgClass} text-sm  border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <Icon className="absolute w-5 h-5 text-gray-500 left-3 top-1/2 -translate-y-1/2" size={18} />
        </form>
    )
}
export default Searchbar
