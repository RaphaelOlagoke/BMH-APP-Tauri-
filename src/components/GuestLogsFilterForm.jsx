import React from 'react'
import Searchbar from "./Searchbar.jsx";
import DateFilter from "./DateFilter.jsx";

const GuestLogsFilterForm = ({ headerText,
     roomNumber,
     setRoomNumber,
     selectedPaymentStatus,
     setSelectedPaymentStatus,
     paymentStatusOptions,
     selectedStatus,
     setSelectedStatus,
     statusOptions,
     roomOptions,
     startDate,
     endDate,
     setStartDate,
     setEndDate,
     onSubmit
}) => {
    return (
        <div >
            <div className="flex justify-between items-center">
                <h2 className="text-2xl">{headerText}</h2>
                <div className="flex items-center space-x-5 justify-end">

                    {/*  Room Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">Room</p>
                        <select
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(e.target.value)}
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

                    {/*  Status Dropdown */}
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

                    {/* Payment Status Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">Payment Status</p>
                        <select
                            value={selectedPaymentStatus}
                            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                            className="border border-blue-300 rounded px-5 py-2  text-sm"
                        >
                            <option value="">All</option>
                            {paymentStatusOptions.map((room) => (
                                <option key={room} value={room}>
                                    {room}
                                </option>
                            ))}
                        </select>
                    </div>

                    <DateFilter startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
                    <button
                        type="button"
                        onClick={() => onSubmit()}
                        className="bg-blue-600 text-white px-4 py-2 mt-5 rounded hover:bg-blue-700 transition text-sm"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}
export default GuestLogsFilterForm
