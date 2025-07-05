import React, {useEffect, useState} from 'react'
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import InventoryHistoryFilter from "../components/InventoryHistoryFilter.jsx";
import BackButton from "../components/BackButton.jsx";

const InventoryHistory = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [tableSearchTerm, SetTableSearchTerm] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    const [selectedReason, setSelectedReason] = useState('');

    const categoryOptions = ["ROOM", "RESTAURANT_BAR", "HOUSE_KEEPING", "MAINTENANCE", "OFFICE_SUPPLIES", "OTHERS"];

    const reasonOptions = ["MISCOUNT", "DAMAGED", "EXPIRED", "RETURNED", "RESTOCK", "OTHER", "TRANSFERRED"];

    const actionOptions = ["ADDED", "TRANSFERRED", "RETRIEVED", "REMOVED"];

    // const navigate = useNavigate();

    const totalPages = 3;

    const columns = [
        { label: "Ref", accessor: "ref" },
        { label: "Name", accessor: "name" },
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

    const dataList = [
        {
            ref: "SH001",
            item: {
                ref: "STK001",
                category: "HOUSE_KEEPING",
                name: "Glass Cleaner",
                quantity: 25,
                unit: "bottles",
                expiryDate: "2025-09-15",
                createdDateTime: "2025-06-01T08:30:00",
                lastModifiedDateTime: "2025-06-10T10:00:00"
            },
            name: "Glass Cleaner",
            department: "HOUSE_KEEPING",
            quantityMoved: 5,
            unit: "bottles",
            reason: "CLEANING_TASK", // StockActionReason enum
            action: "ADDED",       // StockHistoryAction enum
            timestamp: "2025-06-11T09:00:00"
        },
        {
            ref: "SH002",
            item: {
                ref: "STK002",
                category: "RESTAURANT_BAR",
                name: "Instant Noodles",
                quantity: 100,
                unit: "packs",
                expiryDate: "2025-12-31",
                createdDateTime: "2025-06-05T09:00:00",
                lastModifiedDateTime: "2025-06-15T11:00:00"
            },
            name: "Instant Noodles",
            department: "RESTAURANT_BAR",
            quantityMoved: 20,
            unit: "packs",
            reason: "STOCK_REPLENISHMENT",
            action: "REMOVED",
            timestamp: "2025-06-20T14:30:00"
        },
        {
            ref: "SH003",
            item: {
                ref: "STK003",
                category: "MAINTENANCE",
                name: "LED Bulb",
                quantity: 50,
                unit: "pieces",
                expiryDate: null,
                createdDateTime: "2025-06-10T14:20:00",
                lastModifiedDateTime: "2025-06-20T09:45:00"
            },
            name: "LED Bulb",
            department: "MAINTENANCE",
            quantityMoved: 10,
            unit: "pieces",
            reason: "REPAIR_TASK",
            action: "REMOVED",
            timestamp: "2025-06-22T08:15:00"
        },
        {
            ref: "SH004",
            item: {
                ref: "STK005",
                category: "RESTAURANT_BAR",
                name: "Mineral Water",
                quantity: 200,
                unit: "bottles",
                expiryDate: "2025-08-01",
                createdDateTime: "2025-06-15T07:45:00",
                lastModifiedDateTime: "2025-06-28T08:10:00"
            },
            name: "LED Bulb",
            department: "RESTAURANT_BAR",
            quantityMoved: 12,
            unit: "bottles",
            reason: "GUEST_REQUEST",
            action: "REMOVED",
            timestamp: "2025-06-25T10:00:00"
        },
        {
            ref: "SH005",
            item: {
                ref: "STK004",
                category: "MAINTENANCE",
                name: "PVC Pipe",
                quantity: 30,
                unit: "meters",
                expiryDate: null,
                createdDateTime: "2025-06-12T13:00:00",
                lastModifiedDateTime: "2025-06-25T15:30:00"
            },
            name: "PVC Pipe",
            department: "MAINTENANCE",
            quantityMoved: 3,
            unit: "meters",
            reason: "PIPE_REPLACEMENT",
            action: "REMOVED",
            timestamp: "2025-06-27T16:45:00"
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
        <div className="flex flex-col" >

            <BackButton/>

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
