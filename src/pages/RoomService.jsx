import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {menuItems} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import CreateRoomService from "../Modals/CreateRoomService.jsx";
import UpdateRoomService from "../Modals/UpdateRoomService.jsx";
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import {useNavigate} from "react-router-dom";

const RoomService = () => {

    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [service, setService] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState(false);
    const navigate = useNavigate();



    const columns = [
        { label: "Service", accessor: "service" },
        { label: "Price", accessor: "price" , render: (value) => (
                <span className={`px-2 py-1 text-[15px]`}>
                ₦{value}
            </span>
        )},
    ];


    const fetchData = async () => {
        // const res = await fetch(`/api/items?page=${page}`);
        // const { data, totalPages } = await res.json();

        setLoading(true);
        try {
            const res = await restClient.get('/room/service/filter?query=', navigate);
            console.log("Room Service",res)
            // console.log(res)
            if (res?.responseHeader?.responseCode === "00") {
                setData(res.data);
                setPageCount(1);
            }
            else{
                setModalMessage("Something went wrong");
                setShowModal(true);
            }
        } catch (error) {
            console.log(error);
            setModalMessage("Something went wrong");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage <= pageCount) {
            setPage(newPage);
        }
    };


    const handleEdit = (roomService) => {
        setService(roomService);
        setShowUpdateModal(true);
    }

    const onSubmit = () =>{
        fetchData();
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
                        <CreateRoomService
                            onClose={() => setShowCreateModal(false)}
                            onSubmit={onSubmit}
                        />
                    )}
                </div>
                <Table
                    filterForm={<h2 className="text-2xl text-start">Room Service</h2>}
                    columns={columns}
                    data={data}
                    currentPage={page}
                    totalPages={pageCount}
                    onPageChange={handlePageChange}
                    onEdit={(room) => handleEdit(room)}
                    showEdit={true}
                />
            </main>

            {showUpdateModal && (
                <UpdateRoomService
                    service={service}
                    onClose={() => setShowUpdateModal(false)}
                    onSubmit={onSubmit}
                />
            )}

            {showModal && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => setShowModal(false)}
                />
            )}

        </div>
    )
}
export default RoomService;
