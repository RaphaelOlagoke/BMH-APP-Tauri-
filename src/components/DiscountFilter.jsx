import React from 'react'
import DateFilter from "./DateFilter.jsx"


const DiscountFilter = ({
    headerText,
    isActive,
    setIsActive,
    isOneTimeUse,
    setIsOneTimeUse,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    onSubmit,
    booleanOptions
}) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl">{headerText}</h2>
                <div className="flex items-center space-x-5 justify-end">

                    {/* Is Active Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">Is Active</p>
                        <select
                            value={isActive}
                            onChange={(e) => setIsActive(e.target.value)}
                            className="border border-blue-300 rounded px-5 py-2  text-sm"
                        >
                            <option value="">All</option>
                            {booleanOptions.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* IsOneTimeUse Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">One Time Use</p>
                        <select
                            value={isOneTimeUse}
                            onChange={(e) => setIsOneTimeUse(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="">All</option>
                            {booleanOptions.map((item) => (
                                <option key={item} value={item}>
                                    {item}
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

export default DiscountFilter
