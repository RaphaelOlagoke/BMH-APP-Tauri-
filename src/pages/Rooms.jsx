import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {menuItems} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import CreateReservation from "../Modals/CreateReservation.jsx";
import RoomsFilter from "../components/RoomsFilter.jsx";
import CreateRoom from "../Modals/CreateRoom.jsx";
import {useNavigate} from "react-router-dom";

const Rooms = () => {
    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState('');
    const [needsCleaning, setNeedsCleaning] = useState('');
    const [needsMaintenance, setNeedsMaintenance] = useState('');
    const [archived, setArchived] = useState('');
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const roomOptions = ["101", "102", "103", "104", "105", "106", "107", "108", "109"];
    const statusOptions = ["Active", "Inactive"];
    const roomTypeOptions = ["Standard", "Deluxe"];


    const totalPages = 20;

    const columns = [
        { label: "Room Number", accessor: "roomNumber" },
        { label: "Type", accessor: "roomType" },
        { label: "Status", accessor: "roomStatus", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-blue-200 text-blue-700'}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
        { label: "Needs Cleaning", accessor: "needsCleaning", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === false ? 'bg-green-100 text-green-800' : 'bg-red-200 text-red-700'}`}>
                {value === true ? 'YES' : 'NO'}
            </span>
            )},
        { label: "Needs Maintenance", accessor: "needsMaintenance", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === false ? 'bg-green-100 text-green-800' : 'bg-red-200 text-red-700'}`}>
                {value === true ? 'YES' : 'NO'}
            </span>
            )},
        { label: "Archived", accessor: "archived", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === false ? 'bg-green-100 text-green-800' : 'bg-red-200 text-red-700'}`}>
                {value === true ? 'YES' : 'NO'}
            </span>
            )},
    ];

    const dataList = [
        {
            roomNumber: 101,
            roomType: "STANDARD", // RoomType enum
            roomStatus: "OCCUPIED", // RoomStatus enum
            needsCleaning: true,
            needsMaintenance: false,
            archived: false,
            maintenance: [
                {
                    ref: "MT001",
                    description: "AC not cooling",
                    cost: 5000,
                    status: "PENDING", // MaintenanceStatus enum
                    createdDateTime: "2025-06-20T09:30:00",
                    lastModifiedDateTime: "2025-06-21T10:00:00"
                }
            ]
        },
        {
            roomNumber: 205,
            roomType: "DELUXE",
            roomStatus: "AVAILABLE",
            needsCleaning: false,
            needsMaintenance: false,
            archived: false,
            maintenance: []
        },
        {
            roomNumber: 103,
            roomType: "DELUXE",
            roomStatus: "MAINTENANCE",
            needsCleaning: false,
            needsMaintenance: true,
            archived: false,
            maintenance: [
                {
                    ref: "MT002",
                    description: "Leaky faucet",
                    cost: 2000,
                    status: "COMPLETED",
                    createdDateTime: "2025-06-22T08:00:00",
                    lastModifiedDateTime: "2025-06-23T11:45:00"
                }
            ]
        },
        {
            roomNumber: 104,
            roomType: "SUITE",
            roomStatus: "OCCUPIED",
            needsCleaning: true,
            needsMaintenance: false,
            archived: false,
            maintenance: []
        },
        {
            roomNumber: 105,
            roomType: "SUITE",
            roomStatus: "AVAILABLE",
            needsCleaning: false,
            needsMaintenance: false,
            archived: false,
            maintenance: []
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
                        <CreateRoom
                            roomTypes={roomTypeOptions}
                            onClose={() => setShowCreateModal(false)}
                        />
                    )}
                </div>
                <Table
                    filterForm={
                        <RoomsFilter
                            headerText="Rooms"
                            selectedType={ selectedType }
                            setSelectedType = {setSelectedType}
                            needsCleaning = {needsCleaning}
                            setNeedsCleaning = {setNeedsCleaning}
                            needsMaintenance = {needsMaintenance}
                            setNeedsMaintenance = {setNeedsMaintenance}
                            archived = {archived}
                            setArchived = {setArchived}
                            onSubmit={onSubmit}
                            selectedRoom={selectedRoom}
                            setSelectedRoom={setSelectedRoom}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                            roomOptions={roomOptions}
                            statusOptions={statusOptions}
                            roomTypeOptions = {roomTypeOptions}
                        />
                    }
                    columns={columns}
                    data={data}
                    currentPage={page}
                    totalPages={pageCount}
                    onPageChange={handlePageChange}
                    onEdit={(room) => navigate(`/rooms/${room.roomNumber}`, { state: { room } })}
                    showEdit={true}
                />
            </main>

        </div>
    )
}
export default Rooms
