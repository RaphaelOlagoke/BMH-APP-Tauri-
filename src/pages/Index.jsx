import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import '../index.css';
import {
    LogIn,
    BedDouble,
    CalendarDays,
    Building2,
    ClipboardList,
    Utensils,
    Sparkles,
    FileText,
    RotateCcw,
    Percent,
    Settings,
    Users,
    LogOut
} from 'lucide-react';
import Header from "../components/Header.jsx";
import InfoMenu from "../components/InfoMenu.jsx";
import {
    availableRoomsImg,
    maintenanceRoomsImg,
    menuItems,
    needsCleaningRoomsImg,
    occupiedRoomsImg
} from "../utils/index.js";
import Table from "../components/Table.jsx";
import GuestLogsFilterForm from "../components/GuestLogsFilterForm.jsx";
import {Link, useNavigate} from "react-router-dom";



const roomsList = [
    { label: 'Available rooms', image: availableRoomsImg, count: "44" , value: ""},
    { label: 'Occupied rooms', image: occupiedRoomsImg, count: "44" , value: ""},
    { label: 'Needs Cleaning', image: needsCleaningRoomsImg, count: "44" , value: ""},
    { label: 'Under Maintenance', image: maintenanceRoomsImg, count: "44" , value: ""}
];

const Index = () => {
    const navigate = useNavigate();

    const columns = [
        { label: "Guest Name", accessor: "name" },
        { label: "Status", accessor: "status", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
        { label: "Check-in", accessor: "checkInDate" },
        { label: "Checkout", accessor: "checkoutDate" },
        { label: "Room(s)", accessor: "rooms", render: (rooms) => rooms.join(', ') },
        { label: "Payment Status", accessor: "paymentStatus", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-200 text-red-700'}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
    ];

    const dataList = [
        {
            id: "g1",
            name: "John Doe",
            status: "active",
            checkInDate: "2025-07-01",
            checkoutDate: "2025-07-05",
            phone: "08012345678",
            nextOfKin: "Jane Doe",
            nextOfKinPhone: "08098765432",
            idType: "National ID",
            idRef: "NIN123456789",
            rooms: ["101", "102"],
            roomTypes: ["Standard", "Standard"],
            amountPaid: 50000,
            creditAmount: 20000,
            totalAmount: 70000,
            outstanding: 20000,
            paymentStatus: "paid",
            invoices: [
                {
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
                },
                {
                    ref: "INV-1002",
                    issueDate: "2025-06-20T09:00:00",
                    paymentDate: "2025-06-22T12:00:00",
                    totalAmount: 200000,
                    paymentStatus: "PAID",
                    paymentMethod: "BANK_TRANSFER",
                    service: "HALL_RENTAL",
                    serviceDetails: "Full-day rental of Grand Ballroom",
                    discountCode: "",
                    discountPercentage: 0,
                    discountAmount: 0,
                    amountPaid: 200000,
                    items: []
                },
            ],
        },
        {
            id: "g2",
            name: "Mary Smith",
            status: "completed",
            checkInDate: "2025-06-28",
            checkoutDate: "2025-07-02",
            phone: "08123456789",
            nextOfKin: "Michael Smith",
            nextOfKinPhone: "08199887766",
            idType: "Driver's License",
            idRef: "DL99887766",
            rooms: ["103"],
            roomTypes: ["Deluxe"],
            amountPaid: 75000,
            creditAmount: 0,
            totalAmount: 75000,
            outstanding: 0,
            paymentStatus: "unpaid",
            invoices: [],
        },
        {
            id: "g3",
            name: "Alice Johnson",
            status: "active",
            checkInDate: "2025-07-02",
            checkoutDate: "2025-07-07",
            phone: "09012345678",
            nextOfKin: "Dave Johnson",
            nextOfKinPhone: "09098765432",
            idType: "Passport",
            idRef: "A123456789",
            rooms: ["104", "105"],
            roomTypes: ["Suite", "Suite"],
            amountPaid: 100000,
            creditAmount: 50000,
            totalAmount: 150000,
            outstanding: 50000,
            paymentStatus: "paid",
            invoices: [],
        }
    ];

    // const handleEdit = (item) => {
    //     console.log('Edit clicked for:', item);
    // };
    //
    // const getStatusStyles = (status) => {
    //     switch (status) {
    //         case 'Active':
    //             return 'text-green-800 bg-green-100';
    //         case 'Inactive':
    //             return 'text-red-800 bg-red-100';
    //         case 'Pending':
    //             return 'text-yellow-800 bg-yellow-100';
    //         default:
    //             return 'text-gray-800 bg-gray-100';
    //     }
    // };


    const totalPages = 20;

    const [searchTerm, setSearchTerm] = useState('');
    const [tableSearchTerm, tableSetSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

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

    // const navigate = useNavigate();

    // const handleGoToCheckIn = () => {
    //     navigate('/check-in', {
    //         state: {
    //             reservation: {
    //                 guestName: 'John Doe',
    //                 guestPhone: '08012345678',
    //                 nextOfKin: 'Jane Doe',
    //                 nextOfKinPhone: '08087654321',
    //                 idType: 'Driver’s License',
    //                 idRef: 'DL-12345',
    //                 roomType: 'Deluxe',
    //                 roomNumber: '203',
    //                 price: 15000,
    //                 numDays: 2
    //             }
    //         }
    //     });
    //
    // };

    return (
        <div className="flex" >
            <Sidebar menuItems={menuItems}/>

            <main className="main ps-20 py-6 text-2xl w-full">
                <Header headerText="Hello Evano 👋🏼," value={searchTerm}  onChange={setSearchTerm} />
                <InfoMenu menuItems={roomsList}/>
                <div className="flex justify-end space-x-5 py-3 me-5">
                    <Link
                        to="/check-in"
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 text-white py-3 px-3 rounded-lg font-light text-xs hover:bg-blue-700 transition"
                    >
                        <LogIn size={16} />
                        Check-In
                    </Link>
                    <Link
                        to="/check-out"
                        className="flex items-center gap-2 bg-blue-600 text-white py-3 px-3 rounded-lg font-light text-xs hover:bg-blue-700 transition"
                    >
                        <LogOut size={16} />
                        Check-Out
                    </Link>
                </div>

                <Table
                    filterForm={
                        <GuestLogsFilterForm
                            headerText="Guest Logs"
                            value={tableSearchTerm}
                            onChange={tableSetSearchTerm}
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            onSubmit={onSubmit}
                        />
                    }
                    columns={columns}
                    data={data}
                    currentPage={page}
                    totalPages={pageCount}
                    onPageChange={handlePageChange}
                    onEdit={(guest) => navigate(`/guest-log/${guest.id}`, { state: { guest } })}
                    showEdit={true}
                />
            </main>
        </div>
    )
}
export default Index
