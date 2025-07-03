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
import {availableRoomsImg, maintenanceRoomsImg, needsCleaningRoomsImg, occupiedRoomsImg} from "../utils/index.js";
import Table from "../components/Table.jsx";
import GuestLogsFilterForm from "../components/GuestLogsFilterForm.jsx";

const menuItems = [
    { label: 'Guest Logs', icon: FileText, path: '/' },
    { label: 'Room Reservation', icon: BedDouble, path: '/room-reservation' },
    { label: 'Hall Reservation', icon: CalendarDays, path: '/hall-reservation' },
    { label: 'Rooms', icon: Building2, path: '/rooms' },
    { label: 'Room Service', icon: ClipboardList, path: '/room-service' },
    { label: 'Inventory', icon: ClipboardList, path: '/inventory' },
    { label: 'Restaurant & Bar', icon: Utensils, path: '/restaurant-bar' },
    { label: 'House Keeping', icon: Sparkles, path: '/house-keeping' },
    { label: 'Invoice', icon: FileText, path: '/invoice' },
    { label: 'Refund', icon: RotateCcw, path: '/refund' },
    { label: 'Discount', icon: Percent, path: '/discount' },
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Users', icon: Users, path: '/users' },
];

const roomsList = [
    { label: 'Available rooms', image: availableRoomsImg, count: "44" , value: ""},
    { label: 'Occupied rooms', image: occupiedRoomsImg, count: "44" , value: ""},
    { label: 'Needs Cleaning', image: needsCleaningRoomsImg, count: "44" , value: ""},
    { label: 'Under Maintenance', image: maintenanceRoomsImg, count: "44" , value: ""}
];

const Index = () => {
    const columns = [
        { label: 'Name', accessor: 'name' },
        { label: 'Email', accessor: 'email' },
        {
            label: 'Status',
            accessor: 'status',
            render: (value) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyles(value)}`}>
            {value}
            </span>
            )
        }
    ];

    const dataList = [
        { name: 'John Doe', email: 'john@example.com', status: 'Active' },
        { name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    ];

    const handleEdit = (item) => {
        console.log('Edit clicked for:', item);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Active':
                return 'text-green-800 bg-green-100';
            case 'Inactive':
                return 'text-red-800 bg-red-100';
            case 'Pending':
                return 'text-yellow-800 bg-yellow-100';
            default:
                return 'text-gray-800 bg-gray-100';
        }
    };

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

    return (
        <div className="flex" >
            <Sidebar menuItems={menuItems}/>

            <main className="main ps-20 py-6 text-2xl w-full">
                <Header headerText="Hello Evano 👋🏼," value={searchTerm}  onChange={setSearchTerm} />
                <InfoMenu menuItems={roomsList}/>
                <div className="flex justify-end space-x-5 py-3 me-5">
                    <a
                        href=""
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 text-white py-3 px-3 rounded-lg font-light text-xs hover:bg-blue-700 transition"
                    >
                        <LogIn size={16} />
                        Check-In
                    </a>
                    <a
                        href=""
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 text-white py-3 px-3 rounded-lg font-light text-xs hover:bg-blue-700 transition"
                    >
                        <LogOut size={16} />
                        Check-Out
                    </a>
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
                    onEdit={handleEdit}
                    showEdit={true}
                />
            </main>
        </div>
    )
}
export default Index
