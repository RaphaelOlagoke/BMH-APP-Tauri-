import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import InfoMenu from "../components/InfoMenu.jsx";
import {Link, useNavigate} from "react-router-dom";
import {LogIn, LogOut} from "lucide-react";
import Table from "../components/Table.jsx";
import GuestLogsFilterForm from "../components/GuestLogsFilterForm.jsx";
import {fetchRoomsData, loadRoomsData, menuItems, TABLE_SIZE} from "../utils/index.js";
import RoomReservationFilter from "../components/RoomReservationFilter.jsx";
import CreateButton from "../components/CreateButton.jsx";
import CreateReservation from "../Modals/CreateReservation.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import restClient from "../utils/restClient.js";

const RoomReservation = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [roomOptions, setRoomOptions] = useState([]);

    const [selectedRoom, setSelectedRoom] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState('');
    const navigate = useNavigate();
    const [roomTypes, setRoomTypes] = useState([]);
    const [availableRooms, setAvailableRooms] = useState({});

    // const roomOptions = ["101", "102", "103", "104", "105", "106", "107", "108", "109"];
    const statusOptions = ["ACTIVE", "COMPLETE", "CANCELED"];

    const handleEdit = (reservation) => {
        if (reservation.status === "ACTIVE") {
            navigate('/check-in', {
                state: { reservation }
            });
        } else {
            setModalMessage("Only active reservations can be checked in.");
            setShowModal(true);
        }
    };


    const size = TABLE_SIZE;

    const statusStyles = {
        ACTIVE: "bg-green-100 text-green-800",
        COMPLETE: "bg-blue-200 text-blue-700",
        CANCELED: "bg-red-200 text-red-700",
    };

    const columns = [
        { label: "Guest Name", accessor: "guestName" },
        { label: "Status", accessor: "status", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[value]}`}>
                {value}
            </span>
            )},
        { label: "Date", accessor: "createdDateTime" },
        { label: "Phone number", accessor: "guestPhoneNumber" },
        { label: "Room(s)", accessor: "roomNumbers", render: (rooms) => rooms.map(r => r.roomNumber).join(', ') },
    ];

    const fetchData = async (page) => {
        // const res = await fetch(`/api/items?page=${page}`);
        // const { data, totalPages } = await res.json();

        setLoading(true);
        try {
            const startDateTime = startDate ? `${startDate}T00:00:00` : null;
            const endDateTime = endDate ? `${endDate}T23:59:59` : null;

            const res = await restClient.post(`/reservation/filter?page=${page}&size=${size}`, {
                status: selectedStatus || null,
                startDate: startDateTime,
                endDate: endDateTime,
                roomNumber: selectedRoom || 0,
            },navigate);
            // console.log(res)
            if (res?.responseHeader?.responseCode === "00") {
                setData(res.data);
                if (res.totalPages !== pageCount) {
                    setPageCount(res.totalPages);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    useEffect(() => {
        const fetchRoomsAndPrices = async () => {
            await fetchRoomsData(setModalMessage, setShowModal,setRoomTypes, setAvailableRooms,navigate);
        }
        fetchRoomsAndPrices()
        loadRoomsData(setLoading, setRoomOptions, navigate, "/room/all");
    },[])

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage <= pageCount) {
            setPage(newPage);
        }
    };

    const onSubmit = () => {
        setPage(0);
        fetchData(page)
    };


    const handleSubmitReservation = (data) => {
        console.log('Reservation Submitted:', data);
        setPage(0);
        fetchData(page)
    };

    return (
        <div className="flex" >
            {loading && <LoadingScreen />}
            <Sidebar menuItems={menuItems}/>

            <main className="main ps-20 py-6 mt-3 text-2xl w-full">
                <Header headerText="Hello Evano 👋🏼," />
                <div className="p-4 my-3 me-3">
                    <div className="flex justify-end mb-4">
                        <CreateButton onClick={() => setShowCreateModal(true)} />
                    </div>

                    {showCreateModal && (
                        <CreateReservation
                            roomTypes={roomTypes}
                            availableRooms={availableRooms}
                            onSubmit={handleSubmitReservation}
                            onClose={() => setShowCreateModal(false)}
                        />
                    )}
                </div>
                <Table
                    filterForm={
                        <RoomReservationFilter
                            headerText="Room Reservations"
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            onSubmit={onSubmit}
                            selectedRoom={selectedRoom}
                            setSelectedRoom={setSelectedRoom}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                            roomOptions={roomOptions}
                            statusOptions={statusOptions}
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

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold mb-4">Notice</h2>
                        <p className="text-sm text-gray-700 mb-6">{modalMessage}</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}
export default RoomReservation
