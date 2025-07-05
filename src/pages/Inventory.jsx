import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {menuItems} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import CreateReservation from "../Modals/CreateReservation.jsx";
import RoomsFilter from "../components/RoomsFilter.jsx";
import CreateRoom from "../Modals/CreateRoom.jsx";
import InventoryFilter from "../components/InventoryFilter.jsx";
import UpdateInventory from "../Modals/UpdateInventory.jsx";
import CreateInventory from "../Modals/CreateInventory.jsx";

const Inventory = () => {

    const [selectedCategory, setSelectedCategory] = useState('');
    const [tableSearchTerm, SetTableSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startExpirationDate, setStartExpirationDate] = useState('');
    const [endExpirationDate, setEndExpirationDate] = useState('');

    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [inventoryItem, setInventoryItem] = useState({});


    const categoryOptions = ["ROOM", "RESTAURANT_BAR", "HOUSE_KEEPING", "MAINTENANCE", "OFFICE_SUPPLIES", "OTHERS"];

    const reasonOptions = ["MISCOUNT", "DAMAGED", "EXPIRED", "RETURNED", "RESTOCK", "OTHER", "TRANSFERRED"];

    const totalPages = 20;

    const columns = [
        { label: "Name", accessor: "name" },
        { label: "Category", accessor: "category" },
        { label: "Quantity", accessor: "quantity"},
        { label: "Unit", accessor: "unit"},
        { label: "Created Date", accessor: "createdDateTime"},
        { label: "Expired Date", accessor: "expiryDate"},
    ];

    const dataList = [
        {
            ref: "STK001",
            category: "MAINTENANCE", // StockItemCategory enum
            name: "Glass Cleaner",
            quantity: 25,
            unit: "bottles",
            expiryDate: "2025-09-15",
            createdDateTime: "2025-06-01T08:30:00",
            lastModifiedDateTime: "2025-06-10T10:00:00"
        },
        {
            ref: "STK002",
            category: "RESTAURANT_BAR",
            name: "Instant Noodles",
            quantity: 100,
            unit: "packs",
            expiryDate: "2025-12-31",
            createdDateTime: "2025-06-05T09:00:00",
            lastModifiedDateTime: "2025-06-15T11:00:00"
        },
        {
            ref: "STK003",
            category: "MAINTENANCE",
            name: "LED Bulb",
            quantity: 50,
            unit: "pieces",
            expiryDate: null, // No expiry for electrical items
            createdDateTime: "2025-06-10T14:20:00",
            lastModifiedDateTime: "2025-06-20T09:45:00"
        },
        {
            ref: "STK004",
            category: "MAINTENANCE",
            name: "PVC Pipe",
            quantity: 30,
            unit: "meters",
            expiryDate: null,
            createdDateTime: "2025-06-12T13:00:00",
            lastModifiedDateTime: "2025-06-25T15:30:00"
        },
        {
            ref: "STK005",
            category: "RESTAURANT_BAR",
            name: "Mineral Water",
            quantity: 200,
            unit: "bottles",
            expiryDate: "2025-08-01",
            createdDateTime: "2025-06-15T07:45:00",
            lastModifiedDateTime: "2025-06-28T08:10:00"
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
        setInventoryItem(item);
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
                        <CreateInventory
                            categories={categoryOptions}
                            onClose={() => setShowCreateModal(false)}
                        />
                    )}
                </div>
                <Table
                    filterForm={
                        <InventoryFilter
                            headerText="Inventory"
                            value={tableSearchTerm}
                            onChange={SetTableSearchTerm}
                            selectedCategory = {selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            startExpirationDate={startExpirationDate}
                            endExpirationDate={endExpirationDate}
                            setStartExpirationDate={setStartExpirationDate}
                            setEndExpirationDate={setEndExpirationDate}
                            onSubmit={onSubmit}
                            categoryOptions = {categoryOptions}
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
                <UpdateInventory
                    inventory={inventoryItem}
                    categories={categoryOptions}
                    reasons={reasonOptions}
                    onClose={() => setShowUpdateModal(false)}
                />
            )}
        </div>
    )
}
export default Inventory
