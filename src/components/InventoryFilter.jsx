import React from 'react'
import DateFilter from "./DateFilter.jsx"
import Searchbar from "./Searchbar.jsx";
import {Book, File, LogIn} from "lucide-react";
import {Link} from "react-router-dom";


const InventoryFilter = ({
     headerText,
     value,
     onChange,
     selectedCategory,
     setSelectedCategory,
     startDate,
     endDate,
     setStartDate,
     setEndDate,
     startExpirationDate,
     endExpirationDate,
     setStartExpirationDate,
     setEndExpirationDate,
     onSubmit,
     categoryOptions
}) => {

    return (
        <form onSubmit={onSubmit}>
            <div className="flex justify-end space-x-5 py-3 me-5">
                <Link
                    to="/inventory-history"
                    type="submit"
                    className="flex items-center gap-2 bg-blue-600 text-white py-3 px-3 rounded-lg font-light text-xs hover:bg-blue-700 transition"
                >
                    <File size={16} />
                    History
                </Link>
            </div>
            <div className="flex justify-between mb-5">
                <h2 className="text-2xl">{headerText}</h2>
                <div>
                    <Searchbar  placeholder= 'Search...' value={value} onChange={onChange} onSubmit={onSubmit} bgClass="border" />
                </div>

            </div>
            <div className="flex justify-between items-center ">
                <div className="flex items-center space-x-5 justify-end flex-wrap space-y-5">
                    {/* Category Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">Category</p>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="border border-blue-300 rounded px-5 py-2  text-sm"
                        >
                            <option value="">All</option>
                            {categoryOptions.map((room) => (
                                <option key={room} value={room}>
                                    {room}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Filter */}
                    <DateFilter
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                    />


                    {/* Date Filter */}
                    <DateFilter
                        startDate={startExpirationDate}
                        endDate={endExpirationDate}
                        setStartDate={setStartExpirationDate}
                        setEndDate={setEndExpirationDate}
                        startTitle={"Expiration Start Date"}
                        endTitle={"Expiration End Date"}
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 mt-5 rounded hover:bg-blue-700 transition text-sm"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    )
}

export default InventoryFilter
