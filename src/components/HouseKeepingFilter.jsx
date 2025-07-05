import React from 'react'
import DateFilter from "./DateFilter.jsx"


const HouseKeepingFilter = ({
     headerText,
    selectedNeedsCleaning,
    setSelectedNeedsCleaning,
     selectedRoom,
     setSelectedRoom,
    selectedStatus,
    setSelectedStatus,
     startDate,
     endDate,
     setStartDate,
     setEndDate,
     onSubmit,
     roomOptions,
    statusOptions,
    roomsNeedsCleaningOptions,
}) => {

    return (
        <form onSubmit={onSubmit}>
            <div className="flex justify-start mb-5">
                <h2 className="text-2xl">{headerText}</h2>
            </div>

            <div className="flex justify-between items-center ">
                <div className="flex items-center space-x-5 justify-end flex-wrap space-y-5">
                    {/* Needs Cleaning Dropdown */}
                    <div className="flex flex-col space-y-2 mt-6">
                        <p className="text-sm">Needs Cleaning</p>
                        <select
                            value={selectedNeedsCleaning}
                            onChange={(e) => setSelectedNeedsCleaning(e.target.value)}
                            className="border border-blue-300 rounded px-5 py-2  text-sm"
                        >
                            <option value="">All</option>
                            {roomsNeedsCleaningOptions.map((room) => (
                                <option key={room} value={room}>
                                    {room}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rooms Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">Rooms</p>
                        <select
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                            className="border border-blue-300 rounded px-5 py-2  text-sm"
                        >
                            <option value="">All</option>
                            {roomOptions.map((room) => (
                                <option key={room} value={room}>
                                    {room}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">Status</p>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="border border-blue-300 rounded px-5 py-2  text-sm"
                        >
                            <option value="">All</option>
                            {statusOptions.map((room) => (
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

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 mt-6 rounded hover:bg-blue-700 transition text-sm"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    )
}

export default HouseKeepingFilter
