import React from 'react'
import DateFilter from "./DateFilter.jsx"
import Searchbar from "./Searchbar.jsx";

const RefundFilter = ({
                           headerText,
                           value,
                           onChange,
                           startDate,
                           endDate,
                           setStartDate,
                           setEndDate,
                           onSubmit
                       }) => {

    return (
        <form onSubmit={onSubmit}>
            <div className="flex justify-between mb-5">
                <h2 className="text-2xl">{headerText}</h2>
                <div>
                    <Searchbar  placeholder= 'Search...' value={value} onChange={onChange} onSubmit={onSubmit} bgClass="border" />
                </div>

            </div>
            <div className="flex justify-between items-center ">
                <div className="flex items-center space-x-5 justify-end flex-wrap space-y-5">

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

export default RefundFilter
