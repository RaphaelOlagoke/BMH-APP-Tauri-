import React from 'react';

const DateFilter = ({ startDate, endDate, setStartDate, setEndDate }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Start Date */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1" htmlFor="start-date">Start Date</label>
                <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* End Date */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1" htmlFor="end-date">End Date</label>
                <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};

export default DateFilter;
