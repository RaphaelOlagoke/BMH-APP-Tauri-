import React from 'react'
import DateFilter from "./DateFilter.jsx"


const RoomReservationFilter = ({
   headerText,
   startDate,
   endDate,
   setStartDate,
   setEndDate,
   onSubmit,
   selectedRoom,
   setSelectedRoom,
   selectedStatus,
   setSelectedStatus,
   roomOptions,
   statusOptions
}) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl">{headerText}</h2>
                <div className="flex items-center space-x-5 justify-end">

                    {/* Room Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">Room</p>
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
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="">All</option>
                            {statusOptions.map((status) => (
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

export default RoomReservationFilter
