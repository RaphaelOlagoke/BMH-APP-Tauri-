import React from 'react'
import DateFilter from "./DateFilter.jsx"
import Searchbar from "./Searchbar.jsx";

const InvoiceFilter = ({
     headerText,
     value,
     onChange,
     selectedPaymentMethod,
     setSelectedPaymentMethod,
    selectedService,
    setSelectedService,
    selectedPaymentStatus,
    setSelectedPaymentStatus,
     startDate,
     endDate,
     setStartDate,
     setEndDate,
     onSubmit,
     paymentMethodOptions,
     paymentStatusOptions,
     serviceOptions
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

                    {/* Payment Method Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">Payment Method</p>
                        <select
                            value={selectedPaymentMethod}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="border border-blue-300 rounded px-5 py-2  text-sm"
                        >
                            <option value="">All</option>
                            {paymentMethodOptions.map((room) => (
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

                    {/* Service Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">Service</p>
                        <select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="border border-blue-300 rounded px-5 py-2  text-sm"
                        >
                            <option value="">All</option>
                            {serviceOptions.map((room) => (
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
                        className="bg-blue-600 text-white px-4 py-2 mt-5 rounded hover:bg-blue-700 transition text-sm"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    )
}

export default InvoiceFilter
