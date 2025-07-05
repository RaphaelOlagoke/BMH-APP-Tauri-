import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import InfoMenu from "../components/InfoMenu.jsx";
import {Link, useNavigate} from "react-router-dom";
import {LogIn, LogOut} from "lucide-react";
import Table from "../components/Table.jsx";
import GuestLogsFilterForm from "../components/GuestLogsFilterForm.jsx";
import {menuItems} from "../utils/index.js";
import RoomReservationFilter from "../components/RoomReservationFilter.jsx";
import CreateButton from "../components/CreateButton.jsx";
import CreateReservation from "../Modals/CreateReservation.jsx";

const RoomReservation = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const roomOptions = ["101", "102", "103", "104", "105", "106", "107", "108", "109"];
    const statusOptions = ["Active", "Inactive"];

    const handleEdit = (reservation) => {
        if (reservation.status === "active") {
            navigate('/check-in', {
                state: { reservation }
            });
        } else {
            setModalMessage("Only active reservations can be checked in.");
            setShowModal(true);
        }
    };


    const totalPages = 20;

    const columns = [
        { label: "Guest Name", accessor: "name" },
        { label: "Status", accessor: "status", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
        { label: "Date", accessor: "date" },
        { label: "Phone number", accessor: "phone" },
        { label: "Room(s)", accessor: "rooms", render: (rooms) => rooms.join(', ') },
    ];

    const dataList = [
        {
            ref: "g1",
            name: "John Doe",
            status: "active",
            phone: "08012345678",
            roomList: [{number: "101", type: "Standard", price: 5000}, {number: "205", type: "Deluxe", price: 10000}],
            rooms: ["101", "102"],
            roomTypes: ["Standard", "Standard"],
            date: "2025-06-28",
        },
        {
            ref: "g2",
            name: "Mary Smith",
            status: "completed",
            phone: "08199887766",
            roomList: [{number: "103", type: "Deluxe", price: 10000}],
            rooms: ["103"],
            roomTypes: ["Deluxe"],
            date: "2025-06-28",
        },
        {
            ref: "g3",
            name: "Alice Johnson",
            status: "active",
            phone: "08199887766",
            rooms: ["104", "105"],
            roomList: [{number: "104", type: "Suite", price: 15000}, {number: "105", type: "Suite", price: 15000}],
            roomTypes: ["Suite", "Suite"],
            date: "2025-06-28",
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

    const roomTypes = [
        { type: 'Standard', price: 20000 },
        { type: 'Deluxe', price: 30000 },
        { type: 'Suite', price: 50000 },
    ];

    const availableRooms = {
        Standard: ['101', '102'],
        Deluxe: ['201'],
        Suite: ['301', '302'],
    };

    const handleSubmitReservation = (data) => {
        console.log('Reservation Submitted:', data);
        // Send to API or update state
    };

    const navigate = useNavigate();
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
