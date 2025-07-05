import React from 'react'
import DateFilter from "./DateFilter.jsx"
import Searchbar from "./Searchbar.jsx";


const InventoryHistoryFilter = ({
   headerText,
    value,
    onChange,
   startDate,
   endDate,
   setStartDate,
   setEndDate,
   onSubmit,
   selectedCategory,
   setSelectedCategory,
   selectedAction,
   setSelectedAction,
   selectedReason,
   setSelectedReason,
   categoryOptions,
   actionOptions,
   reasonOptions
}) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="flex justify-between mb-5">
                <div>
                    <h2 className="text-2xl">{headerText}</h2>
                </div>
                <div>
                    <Searchbar  placeholder= 'Search...' value={value} onChange={onChange} bgClass="border" />
                </div>

            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-5 justify-end">

                    {/* Category Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">Category</p>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="border border-blue-300 rounded px-5 py-2  text-sm"
                        >
                            <option value="">All</option>
                            {categoryOptions.map((hall) => (
                                <option key={hall} value={hall}>
                                    {hall}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Action Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">Action</p>
                        <select
                            value={selectedAction}
                            onChange={(e) => setSelectedAction(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="">All</option>
                            {actionOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Reason Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">Reason</p>
                        <select
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="">All</option>
                            {reasonOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
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

export default InventoryHistoryFilter
