import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {menuItems} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import CreateRoomService from "../Modals/CreateRoomService.jsx";
import UpdateRoomService from "../Modals/UpdateRoomService.jsx";

const RoomService = () => {

    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [service, setService] = useState({});


    const totalPages = 20;

    const columns = [
        { label: "Service", accessor: "service" },
        { label: "Price", accessor: "price" , render: (value) => (
                <span className={`px-2 py-1 text-[15px]`}>
                ₦{value}
            </span>
        )},
    ];

    const dataList = [
        {
            ref: "SRV001",
            service: "Room Cleaning",
            price: 3000.0
        },
        {
            ref: "SRV002",
            service: "Laundry Service",
            price: 2000.0
        },
        {
            ref: "SRV003",
            service: "Airport Pickup",
            price: 5000.0
        },
        {
            ref: "SRV004",
            service: "Breakfast Buffet",
            price: 2500.0
        },
        {
            ref: "SRV005",
            service: "Spa Session",
            price: 7000.0
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


    const handleEdit = (roomService) => {
        setService(roomService);
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
                        <CreateRoomService
                            onClose={() => setShowCreateModal(false)}
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
                />
            )}

        </div>
    )
}
export default RoomService;
