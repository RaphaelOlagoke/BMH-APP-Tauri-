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
    availableRoomsImg, getUser, loadRoomsData,
    maintenanceRoomsImg,
    menuItems,
    needsCleaningRoomsImg,
    occupiedRoomsImg
} from "../utils/index.js";
import Table from "../components/Table.jsx";
import GuestLogsFilterForm from "../components/GuestLogsFilterForm.jsx";
import {Link, useNavigate} from "react-router-dom";
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

// const roomsList = [
//     { label: 'Available rooms', image: availableRoomsImg, count: "44" , value: ""},
//     { label: 'Occupied rooms', image: occupiedRoomsImg, count: "44" , value: ""},
//     { label: 'Needs Cleaning', image: needsCleaningRoomsImg, count: "44" , value: ""},
//     { label: 'Under Maintenance', image: maintenanceRoomsImg, count: "44" , value: ""}
// ];

const statusStyles = {
    ACTIVE: "bg-green-100 text-green-800",
    COMPLETE: "bg-blue-200 text-blue-700",
    OVERDUE: "bg-red-200 text-red-700",
};

const Index = () => {
    const navigate = useNavigate();

    const columns = [
        { label: "Guest Name", accessor: "guestName" },
        { label: "Status", accessor: "status", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[value]}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
        { label: "Check-in", accessor: "checkInDate" },
        { label: "Checkout", accessor: "checkOutDate" },
        { label: "Room(s)", accessor: "guestLogRooms", render: (rooms) => rooms.map(r => r.room.roomNumber).join(', ') },
        { label: "Payment Status", accessor: "paymentStatus", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-200 text-red-700'}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
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

    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [roomNumber, setRoomNumber] = useState(0);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [roomsList, setRoomsList] = useState([]);
    const [roomOptions, setRoomOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");


    const paymentStatusOptions = ["UNPAID", "PAID", "DEBIT", "REFUNDED"];
    const statusOptions = ["ACTIVE", "COMPLETE", "OVERDUE"];


    const size = 20;

    const loadRoomSummaryData = async () => {
        setLoading(true);
        try {
            const res = await restClient.get('/room/roomSummary',navigate);
            setRoomsList(res.data);
            // console.log(res)
            if(res.data && res.responseHeader.responseCode === "00") {
                const data = res.data
                setRoomsList([
                    { label: 'Available rooms', image: availableRoomsImg, count: data.noOfAvailableRooms , value: ""},
                    { label: 'Occupied rooms', image: occupiedRoomsImg, count: data.noOfOccupiedRooms , value: ""},
                    { label: 'Needs Cleaning', image: needsCleaningRoomsImg, count: data.noOfRoomsThatNeedCleaning , value: ""},
                    { label: 'Under Maintenance', image: maintenanceRoomsImg, count: data.noOfRoomsThatNeedMaintenance , value: ""}
                ]);
            }
        }
        catch (error) {
           console.log(error);
        }
        finally {
            setLoading(false);
        }
    }



    const fetchData = async (page) => {
        // if(roomsList.length === 0){
        //     loadRoomSummaryData();
        // }
        setLoading(true);
        try {
            const startDateTime = startDate ? `${startDate}T00:00:00` : null;
            const endDateTime = endDate ? `${endDate}T23:59:59` : null;

            const res = await restClient.post(`/guestLog/filter?page=${page}&size=${size}`, {
                status: selectedStatus || null,
                paymentStatus: selectedPaymentStatus || null,
                startDate: startDateTime,
                endDate: endDateTime,
                roomNumber: roomNumber || 0,
            },navigate);
            // console.log(res)
            if (res?.responseHeader?.responseCode === "00") {
                setData(res.data);
                if (res.totalPages !== pageCount) {
                    setPageCount(res.totalPages);
                }
            }
            else{
                setModalMessage(res.error ?? "Something went wrong!");
                setShowModal(true);
            }
        } catch (error) {
            console.log(error);
            setModalMessage( "Something went wrong!");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // console.log("Running useEffect with page:", page);
        fetchData(page);
    }, [page]);

    useEffect(() => {
        loadRoomSummaryData();
        loadRoomsData(setLoading, setRoomOptions, roomOptions,"/room/");
    },[])

    const handlePageChange = (newPage) => {
        if (newPage !== page && newPage >= 0 && newPage <= pageCount) {
            setPage(newPage);
        }
    };

    const onSubmit = async () => {
        console.log("Submitting");
        setPage(0);
        await loadRoomSummaryData();
        await fetchData(page)
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
            {loading && <LoadingScreen />}
            <Sidebar menuItems={menuItems}/>

            <main className="main ps-20 py-6 text-2xl w-full">
                <Header headerText="Hello Evano 👋🏼," value={searchTerm}  onChange={setSearchTerm} />
                <InfoMenu menuItems={roomsList}/>
                {getUser().department === "SUPER_ADMIN" || getUser().department === "RECEPTIONIST" && (
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
                    )
                }

                <Table
                    filterForm={
                        <GuestLogsFilterForm
                            headerText="Guest Logs"
                            selectedPaymentStatus={selectedPaymentStatus}
                            setSelectedPaymentStatus={setSelectedPaymentStatus}
                            paymentStatusOptions={paymentStatusOptions}
                            setSelectedStatus={setSelectedStatus}
                            selectedStatus={selectedStatus}
                            statusOptions={statusOptions}
                            roomNumber={roomNumber}
                            setRoomNumber={setRoomNumber}
                            roomOptions={roomOptions}
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
                    onEdit={(guest) => navigate(`/guest-log/${guest.guestName}`, { state:  guest  })}
                    showEdit={true}
                />
            </main>

            {showModal && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    )
}
export default Index
