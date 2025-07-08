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
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import {useNavigate} from "react-router-dom";

const Inventory = () => {

    const [selectedCategory, setSelectedCategory] = useState('');
    const [tableSearchTerm, SetTableSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startExpirationDate, setStartExpirationDate] = useState('');
    const [endExpirationDate, setEndExpirationDate] = useState('');

    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [inventoryItem, setInventoryItem] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const categoryOptions = ["ROOM", "RESTAURANT_BAR", "HOUSE_KEEPING", "MAINTENANCE", "OFFICE_SUPPLIES", "OTHERS"];

    const reasonOptions = ["MISCOUNT", "DAMAGED", "EXPIRED", "RETURNED", "RESTOCK", "OTHER", "TRANSFERRED"];

    const size = 20;

    const columns = [
        { label: "Name", accessor: "name" },
        { label: "Category", accessor: "category" },
        { label: "Quantity", accessor: "quantity"},
        { label: "Unit", accessor: "unit"},
        { label: "Created Date", accessor: "createdDateTime"},
        { label: "Expired Date", accessor: "expiryDate"},
    ];


    const fetchData = async (page) => {
        // const res = await fetch(`/api/items?page=${page}`);
        // const { data, totalPages } = await res.json();

        setLoading(true);
        try {
            const startDateTime = startDate ? `${startDate}T00:00:00` : null;
            const endDateTime = endDate ? `${endDate}T23:59:59` : null;

            const res = await restClient.post(`/inventory/filterStockItems?page=${page}&size=${size}&query=${tableSearchTerm}`, {
                category: selectedCategory || null,
                startExpiryDate: startExpirationDate || null,
                endExpiryDate: endExpirationDate  || null,
               startDate: startDateTime,
                endDate: endDateTime,
                quantity: 0
            },navigate);
            console.log(res)
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

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage <= pageCount) {
            setPage(newPage);
        }
    };

    const onSubmit = () => {
        fetchData(page)
    };

    const handleEdit = (item) => {
        setInventoryItem(item);
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
                        <CreateInventory
                            categories={categoryOptions}
                            onClose={() => setShowCreateModal(false)}
                            onSubmit={onSubmit}
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
                    onSubmit={onSubmit}
                />
            )}
        </div>
    )
}
export default Inventory
