import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {menuItems} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import HouseKeepingFilter from "../components/HouseKeepingFilter.jsx";
import CreateHouseKeeping from "../Modals/CreateHouseKeeping.jsx";
import UpdateHouseKeeping from "../Modals/UpdateHouseKeeping.jsx";

const HouseKeeping = () => {

    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedNeedsCleaning, setSelectedNeedsCleaning] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [item, setItem] = useState({});


    const roomOptions = ["101", "102", "103", "104", "105", "106", "107", "108", "109"];

    const statusOptions = ["IN_PROGRESS", "COMPLETED", "CANCELED"];

    const roomsNeedsCleaningOptions = ["101", "102"];

    const totalPages = 20;

    const statusStyles = {
        COMPLETED: "bg-green-100 text-green-800",
        IN_PROGRESS: "bg-yellow-200 text-yellow-700",
        CANCELED: "bg-red-200 text-red-700",
    };

    const columns = [
        { label: "Room Number", accessor: "roomNumber" },
        { label: "Status", accessor: "status", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[value]} `}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
        { label: "Assigned On", accessor: "assignedOn"},
        { label: "Completed On", accessor: "completedOn"},
    ];

    const dataList = [
        {
            ref: "CLN001",
            room: { roomNumber: "101", floor: 1 },
            roomNumber: "101",
            status: "IN_PROGRESS", // CleaningStatus enum
            assignedOn: "2025-07-01T09:00:00",
            completedOn: null,
            cleaningType: "DAILY" // CleaningType enum
        },
        {
            ref: "CLN002",
            room: { roomNumber: "102", floor: 1 },
            status: "COMPLETED",
            roomNumber: "102",
            assignedOn: "2025-07-01T08:00:00",
            completedOn: "2025-07-01T09:30:00",
            cleaningType: "CHECKOUT"
        },
        {
            ref: "CLN003",
            room: { roomNumber: "203", floor: 2 },
            status: "IN_PROGRESS",
            roomNumber: "203",
            assignedOn: "2025-07-05T10:15:00",
            completedOn: null,
            cleaningType: "DEEP"
        },
        {
            ref: "CLN004",
            room: { roomNumber: "204", floor: 2 },
            status: "IN_PROGRESS",
            roomNumber: "204",
            assignedOn: "2025-07-05T11:00:00",
            completedOn: null,
            cleaningType: "DAILY"
        },
        {
            ref: "CLN005",
            room: { roomNumber: "305", floor: 3 },
            roomNumber: "305",
            status: "COMPLETED",
            assignedOn: "2025-07-03T07:30:00",
            completedOn: "2025-07-03T08:45:00",
            cleaningType: "CHECKOUT"
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

    const handleEdit = (item) => {
        setItem(item);
        setShowUpdateModal(true);
    }


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
                        <CreateHouseKeeping
                            rooms={roomOptions}
                            onClose={() => setShowCreateModal(false)}
                        />
                    )}
                </div>
                <Table
                    filterForm={
                        <HouseKeepingFilter
                            headerText="House Keepping"
                            selectedRoom= {selectedRoom}
                            setSelectedRoom={setSelectedRoom}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                            selectedNeedsCleaning={selectedNeedsCleaning}
                            setSelectedNeedsCleaning={setSelectedNeedsCleaning}
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate = {setStartDate}
                            setEndDate = {setEndDate}
                            onSubmit={onSubmit}
                            roomOptions={roomOptions}
                            statusOptions= {statusOptions}
                            roomsNeedsCleaningOptions = {roomsNeedsCleaningOptions}
                        />
                    }
                    columns={columns}
                    data={data}
                    currentPage={page}
                    totalPages={pageCount}
                    onPageChange={handlePageChange}
                    onEdit={(item) => handleEdit(item)}
                    showEdit={true}
                />
            </main>

            {showUpdateModal && (
                <UpdateHouseKeeping
                    item={item}
                    statusList={statusOptions}
                    onClose={() => setShowUpdateModal(false)}
                />
            )}
        </div>
    )
}
export default HouseKeeping
