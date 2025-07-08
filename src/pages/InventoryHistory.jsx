import React, {useEffect, useState} from 'react'
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import InventoryHistoryFilter from "../components/InventoryHistoryFilter.jsx";
import BackButton from "../components/BackButton.jsx";
import restClient from "../utils/restClient.js";
import {useNavigate} from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen.jsx";
import {ArrowLeft} from "lucide-react";

const InventoryHistory = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [tableSearchTerm, SetTableSearchTerm] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    const [selectedReason, setSelectedReason] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const categoryOptions = ["ROOM", "RESTAURANT_BAR", "HOUSE_KEEPING", "MAINTENANCE", "OFFICE_SUPPLIES", "OTHERS"];

    const reasonOptions = ["MISCOUNT", "DAMAGED", "EXPIRED", "RETURNED", "RESTOCK", "OTHER", "TRANSFERRED"];

    const actionOptions = ["ADDED", "TRANSFERRED", "RETRIEVED", "REMOVED"];

    // const navigate = useNavigate();

    const size = 20;

    const columns = [
        { label: "Ref", accessor: "ref" },
        { label: "Name", accessor: "item", render: (value) => value.name },
        { label: "Quantity", accessor: "quantityMoved" },
        { label: "Unit", accessor: "unit" },
        { label: "Category", accessor: "department" },
        { label: "Reason", accessor: "reason" },
        { label: "Action", accessor: "action", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === 'ADDED' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
        { label: "Date", accessor: "timestamp" }
    ];


    const fetchData = async (page) => {
        // const res = await fetch(`/api/items?page=${page}`);
        // const { data, totalPages } = await res.json();

        setLoading(true);
        try {
            const startDateTime = startDate ? `${startDate}T00:00:00` : null;
            const endDateTime = endDate ? `${endDate}T23:59:59` : null;

            const res = await restClient.post(`/inventory/filterStockHistory?page=${page}&size=${size}&query=${tableSearchTerm}`, {
                department: selectedCategory || null,
                reason: selectedReason || null,
                action: selectedAction || null,
                startDate: startDateTime,
                endDate: endDateTime
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
        fetchData(page);
    };



    return (
        <div className="flex flex-col" >
            {loading && <LoadingScreen />}
            <div className="flex items-center pt-5 ps-5 space-x-2 mb-4 cursor-pointer" onClick={() => navigate('/inventory', { replace: true }) }>
                <ArrowLeft className="text-gray-700" />
                <span className="text-sm text-gray-700">Back</span>
            </div>

            <main className="main ps-20 py-6 mt-3 text-2xl w-full">
                {/*<div className="mb-5">*/}
                {/*    <Header headerText="Hello Evano 👋🏼," />*/}
                {/*</div>*/}
                <Table
                    filterForm={
                        <InventoryHistoryFilter
                            headerText="Stock History"
                            value={tableSearchTerm}
                            onChange={SetTableSearchTerm}
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            onSubmit={onSubmit}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedAction={selectedAction}
                            setSelectedAction={setSelectedAction}
                            selectedReason={selectedReason}
                            setSelectedReason={setSelectedReason}
                            categoryOptions={categoryOptions}
                            reasonOptions={reasonOptions}
                            actionOptions={actionOptions}
                        />
                    }
                    columns={columns}
                    data={data}
                    currentPage={page}
                    totalPages={pageCount}
                    onPageChange={handlePageChange}
                    showEdit={false}
                />
            </main>

        </div>
    )
}
export default InventoryHistory;
