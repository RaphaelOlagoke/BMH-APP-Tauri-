import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {menuItems} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import CreateReservation from "../Modals/CreateReservation.jsx";
import HallReservationFilter from "../components/HallReservationFilter.jsx";
import CreateHallReservation from "../Modals/CreateHallReservation.jsx";
import {useNavigate} from "react-router-dom";

const HallReservation = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');

    const hallOptions = ["CONFERENCE_ROOM", "MEETING_ROOM", "MEETING_HALL"];
    const statusOptions = ["Active", "Inactive"];
    const paymentStatusOptions = ["Paid", "Unpaid"];

    const hallTypes = [
        { type: 'Conference Hall', price: 50000 },
        { type: 'Banquet Hall', price: 75000 },
        { type: 'Wedding Hall', price: 120000 }
    ];

    const idTypes = ['National ID', 'Passport', 'Driver’s License'];

    const paymentMethods = ['Cash', 'POS', 'Transfer'];



    // const navigate = useNavigate();

    const totalPages = 3;

    const columns = [
        { label: "Guest Name", accessor: "guestName" },
        { label: "Phone number", accessor: "phoneNumber" },
        { label: "Hall", accessor: "hall" },
        { label: "Status", accessor: "status", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
        { label: "Start Date", accessor: "startDate" },
        { label: "End Date", accessor: "endDate" },
        { label: "Payment Status", accessor: "paymentStatus", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-200 text-red-700'}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
    ];

    const dataList = [
        {
            ref: "H001",
            guestName: "John Doe",
            hall: "Grand Ballroom",
            startDate: "2025-06-28T10:00:00",
            endDate: "2025-06-28T18:00:00",
            paymentStatus: "PAID", // Enum value like PaymentStatus.PAID
            status: "ACTIVE",    // Enum value like HallLogStatus.CONFIRMED
            description: "Wedding reception",
            idType: "NATIONAL_ID",
            idRef: "A123456789",
            nextOfKinName: "Jane Doe",
            nextOfKinNumber: "08012345678",
            phoneNumber: "09011223344",
            amountPaid: 1000000,

            invoices: [{
                ref: "INV-1001",
                issueDate: "2025-06-20T09:00:00",
                paymentDate: "2025-06-22T12:00:00",
                totalAmount: 200000,
                paymentStatus: "PAID",
                paymentMethod: "BANK_TRANSFER",
                service: "HALL_RENTAL",
                serviceDetails: "Full-day rental of Grand Ballroom",
                discountCode: "WEDDING10",
                discountPercentage: 10,
                discountAmount: 20000,
                amountPaid: 180000,
                items: [
                    {
                        name: "Hall Rental",
                        quantity: 1,
                        price: 200000
                    }
                ]
            }]
        },
        {
            ref: "H002",
            guestName: "Mary Smith",
            hall: "Conference Room A",
            startDate: "2025-07-01T09:00:00",
            endDate: "2025-07-01T15:00:00",
            paymentStatus: "UNPAID",
            status: "PENDING",
            description: "Corporate meeting",
            idType: "DRIVER_LICENSE",
            idRef: "DL987654321",
            nextOfKinName: "Mark Smith",
            nextOfKinNumber: "08123456789",
            phoneNumber: "07099887766",
            amountPaid: 2000000,

            invoices: [{
                ref: "INV-1002",
                issueDate: "2025-06-25T11:00:00",
                paymentDate: null,
                totalAmount: 100000,
                paymentStatus: "UNPAID",
                paymentMethod: "CASH",
                service: "HALL_RENTAL",
                serviceDetails: "Half-day rental of Conference Room A",
                discountCode: null,
                discountPercentage: 0,
                discountAmount: 0,
                amountPaid: 0,
                items: [
                    {
                        name: "Hall Rental",
                        quantity: 1,
                        price: 100000
                    }
                ]
            }]
        },
        {
            ref: "H003",
            guestName: "Alice Johnson",
            hall: "Outdoor Pavilion",
            startDate: "2025-07-10T14:00:00",
            endDate: "2025-07-10T22:00:00",
            paymentStatus: "PARTIALLY_PAID",
            status: "CONFIRMED",
            description: "Birthday celebration",
            idType: "INTERNATIONAL_PASSPORT",
            idRef: "P234567890",
            nextOfKinName: "Bob Johnson",
            nextOfKinNumber: "08112233445",
            phoneNumber: "08011223344",
            amountPaid: 5000000,

            invoices: [{
                ref: "INV-1003",
                issueDate: "2025-07-01T10:30:00",
                paymentDate: "2025-07-03T16:00:00",
                totalAmount: 150000,
                paymentStatus: "PARTIALLY_PAID",
                paymentMethod: "CARD",
                service: "HALL_RENTAL",
                serviceDetails: "Evening rental of Outdoor Pavilion",
                discountCode: null,
                discountPercentage: 0,
                discountAmount: 0,
                amountPaid: 75000,
                items: [
                    {
                        name: "Hall Rental",
                        quantity: 1,
                        price: 150000
                    }
                ]
            }]
        }
    ];


    const fetchData = async (page) => {
        // const res = await fetch(`/api/items?page=${page}`);
        // const { data, totalPages } = await res.json();

        console.log(page);
        setData(dataList);
        setPageCount(totalPages);
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pageCount) {
            setPage(newPage);
        }
    };

    const onSubmit = () => {

    };


    const handleSubmitReservation = (data) => {
        console.log('Hall Reservation Submitted:', data);
        // Send to API or update state
    };


    return (
        <div className="flex" >
            <Sidebar menuItems={menuItems}/>

            <main className="main ps-20 py-6 mt-3 text-2xl w-full">
                <Header headerText="Hello Evano 👋🏼," />
                <div className="p-4 my-3 me-3">
                    <div className="flex justify-end mb-4">
                        <CreateButton onClick={() => setShowCreateModal(true)} />
                    </div>

                    {showCreateModal && (
                        <CreateHallReservation
                            hallTypes={hallTypes}
                            idTypes={idTypes}
                            paymentMethods={paymentMethods}
                            onSubmit={handleSubmitReservation}
                            onClose={() => setShowCreateModal(false)}
                        />
                    )}
                </div>
                <Table
                    filterForm={
                        <HallReservationFilter
                            headerText="Hall Reservations"
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            onSubmit={onSubmit}
                            selectedRoom={selectedRoom}
                            setSelectedRoom={setSelectedRoom}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                            selectedPaymentStatus={selectedPaymentStatus}
                            setSelectedPaymentStatus={setSelectedPaymentStatus}
                            hallOptions={hallOptions}
                            statusOptions={statusOptions}
                            paymentStatusOptions={paymentStatusOptions}
                        />
                    }
                    columns={columns}
                    data={data}
                    currentPage={page}
                    totalPages={pageCount}
                    onPageChange={handlePageChange}
                    onEdit={(hall) => navigate(`/hall-reservation/${hall.ref}`, { state: { hall } })}
                    showEdit={true}
                />
            </main>

        </div>
    )
}
export default HallReservation
