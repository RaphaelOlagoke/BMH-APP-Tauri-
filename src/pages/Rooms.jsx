import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {menuItems, ROOM_STATUS, ROOM_TYPES} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import CreateReservation from "../Modals/CreateReservation.jsx";
import RoomsFilter from "../components/RoomsFilter.jsx";
import CreateRoom from "../Modals/CreateRoom.jsx";
import {useNavigate} from "react-router-dom";
import restClient from "../utils/restClient.js";
import ConfirmModal from "../components/ConfirmModal.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";

const Rooms = () => {
    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState('');
    const [needsCleaning, setNeedsCleaning] = useState('');
    const [needsMaintenance, setNeedsMaintenance] = useState('');
    const [archived, setArchived] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [roomOptions, setRoomOptions] = useState([]);
    const [modalMessage, setModalMessage] = useState("");

    const statusOptions = ROOM_STATUS;
    const roomTypeOptions = ROOM_TYPES;


    const size = 20;

    const columns = [
        { label: "Room Number", accessor: "roomNumber" },
        { label: "Type", accessor: "roomType" },
        { label: "Status", accessor: "roomStatus", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-blue-200 text-blue-700'}`}>
                {value}
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

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            try {
                const res = await restClient.get("/room/",navigate);
                // console.log(res)
                if(res.responseHeader.responseCode === "00") {
                    const data = res.data;
                    console.log("Room Data",data)
                    setRoomOptions(data.map(room => room.roomNumber))
                    if (res.totalPages !== pageCount) {
                        setPageCount(res.totalPages);
                    }
                }
            }
                // eslint-disable-next-line no-unused-vars
            catch (error) {
                setModalMessage("Something went wrong!")
                setShowModal(true)
            }
            finally {
                setLoading(false);
            }
        }
        fetchRooms();
    }, [])


    const fetchData = async (page) => {
        // const res = await fetch(`/api/items?page=${page}`);
        // const { data, totalPages } = await res.json();
        setLoading(true);
        try {
            const res = await restClient.post(`/room/find?page=${page}&size=${size}`,{
                roomStatus: selectedStatus || null,
                roomNumber: selectedRoom || 0,
                roomType: selectedType || null,
                needsCleaning: (needsCleaning && (needsCleaning === "Yes")) || null,
                needsMaintenance: (needsMaintenance && (needsMaintenance === "Yes")) || null,
                archived: (archived && (archived === "Yes")) || null,
            },navigate);
            // console.log(res)
            if(res.responseHeader.responseCode === "00") {
                const data = res.data;
                // console.log(data)
                setData(data)
                if (res.totalPages !== pageCount) {
                    setPageCount(res.totalPages);
                }
            }
        }
            // eslint-disable-next-line no-unused-vars
        catch (error) {
            setModalMessage("Something went wrong!")
            setShowModal(true)
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage <= pageCount) {
            setPage(newPage);
        }
    };

    const onSubmit = () => {
        setPage(0);
        fetchData(page)
    };

    const handleCreateRoom= () => {
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
                        <CreateRoom
                            roomTypes={roomTypeOptions}
                            onClose={() => setShowCreateModal(false)}
                            onSubmit={handleCreateRoom}
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
            {showModal && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => setShowModal(false)}
                />
            )}

        </div>
    )
}
export default Rooms
