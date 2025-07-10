import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {loadRoomsData, menuItems} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import HouseKeepingFilter from "../components/HouseKeepingFilter.jsx";
import CreateHouseKeeping from "../Modals/CreateHouseKeeping.jsx";
import UpdateHouseKeeping from "../Modals/UpdateHouseKeeping.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import restClient from "../utils/restClient.js";
import {useNavigate} from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal.jsx";

const HouseKeeping = () => {

    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedNeedsCleaning, setSelectedNeedsCleaning] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(false);
    const [roomOptions, setRoomOptions] = useState([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");


    // const roomOptions = ["101", "102", "103", "104", "105", "106", "107", "108", "109"];

    const statusOptions = ["IN_PROGRESS", "COMPLETED", "CANCELED"];

    const [roomsNeedsCleaningOptions, setRoomsNeedsCleaningOptions] = useState([]);

    const size = 20;

    const statusStyles = {
        COMPLETED: "bg-green-100 text-green-800",
        IN_PROGRESS: "bg-yellow-200 text-yellow-700",
        CANCELED: "bg-red-200 text-red-700",
    };

    const columns = [
        { label: "Room Number", accessor: "room", render: (value) => (value.roomNumber) },
        { label: "Status", accessor: "status", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[value]} `}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
        { label: "Assigned On", accessor: "assignedOn"},
        { label: "Completed On", accessor: "completedOn"},
    ];


    const fetchData = async (page) => {
        // const res = await fetch(`/api/items?page=${page}`);
        // const { data, totalPages } = await res.json();

        setLoading(true);
        try {
            const startDateTime = startDate ? `${startDate}T00:00:00` : null;
            const endDateTime = endDate ? `${endDate}T23:59:59` : null;

            const res = await restClient.post(`/cleaningLog/filter?page=${page}&size=${size}`, {
                status: selectedStatus || null,
                assignedOn: startDateTime,
                completedOn: endDateTime,
                cleaningType : null,
                roomNumber:  selectedRoom || 0,
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
            setModalMessage("Something went wrong!");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const loadRoomsNeedsCleaning = async  () => {
        setLoading(true);
        try {
            const res = await restClient.get("/room/needsCleaning",navigate);
            // console.log(res)
            if(res.data && res.responseHeader.responseCode === "00") {
                const data = res.data
                setRoomsNeedsCleaningOptions(data.map(room => room.roomNumber));
            }
            else{
                setModalMessage(res.error ?? "Something went wrong!");
                setShowModal(true);
            }
        }
        catch (error) {
            console.log(error);
            setModalMessage("Something went wrong!");
            setShowModal(true);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData(page);
    }, [page]);

    useEffect(() => {
        loadRoomsNeedsCleaning();
        loadRoomsData(setLoading, setRoomOptions, roomOptions,"/room/");
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

    const handleEdit = (item) => {
        setItem(item);
        setShowUpdateModal(true);
    }


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
                        <CreateHouseKeeping
                            rooms={roomOptions}
                            onClose={() => setShowCreateModal(false)}
                            onSubmit={onSubmit}
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
                    onSubmit={onSubmit}
                />
            )}

            {/* ✅ Missing Fields Modal */}
            {showModal && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => setShowModal(false)}
                />
            )}

        </div>
    )
}
export default HouseKeeping
