import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {menuItems} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import CreateReservation from "../Modals/CreateReservation.jsx";
import DiscountFilter from "../components/DiscountFilter.jsx";
import CreateDiscount from "../Modals/CreateDiscount.jsx";
import UpdateDiscount from "../Modals/UpdateDiscount.jsx";

const Discount = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [discount, setDiscount] = useState({});

    const [isActive, setIsActive] = useState('');
    const [isOneTimeUse, setIsOneTimeUse] = useState('');

    const booleanOptions = ["YES", "NO"];

    const handleEdit = (item) => {
        setDiscount(item);
        setShowUpdateModal(true);
    }

    const statusStyles = {
        true: "bg-green-100 text-green-800",
        false: "bg-red-200 text-red-700",
    };

    const totalPages = 20;

    const columns = [
        { label: "Discount Code", accessor: "code" },
        { label: "Discount Percentage", accessor: "percentage" },
        { label: "Valid From", accessor: "startDate" },
        { label: "Valid To", accessor: "endDate" },
        { label: "Is Active", accessor: "active", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[value]} `}>
                {value ? "Yes" : "No"}
            </span>
            )},
        { label: "One Time Use", accessor: "oneTimeUse" ,render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[value]} `}>
                {value ? "Yes" : "No"}
            </span>
            )},
    ];

    const dataList = [
        {
            code: "DISC10",
            percentage: 10,
            startDate: "2025-07-01T00:00:00",
            endDate: "2025-07-31T23:59:00",
            active: true,
            oneTimeUse: false
        },
        {
            code: "WELCOME25",
            percentage: 25,
            startDate: "2025-01-01T00:00:00",
            endDate: "2025-12-31T23:59:00",
            active: true,
            oneTimeUse: true
        },
        {
            code: "SUMMER15",
            percentage: 15,
            startDate: "2025-06-15T00:00:00",
            endDate: "2025-08-15T23:59:00",
            active: true,
            oneTimeUse: false
        },
        {
            code: "EXPIRED50",
            percentage: 50,
            startDate: "2025-03-01T00:00:00",
            endDate: "2025-05-31T23:59:00",
            active: false,
            oneTimeUse: true
        },
        {
            code: "FLASH5",
            percentage: 5,
            startDate: "2025-07-04T12:00:00",
            endDate: "2025-07-04T18:00:00",
            active: true,
            oneTimeUse: true
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
                        <CreateDiscount
                            onClose={() => setShowCreateModal(false)}
                        />
                    )}
                </div>
                <Table
                    filterForm={
                        <DiscountFilter
                            headerText="Discounts"
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            onSubmit={onSubmit}
                            isActive={isActive}
                            setIsActive={setIsActive}
                            isOneTimeUse={isOneTimeUse}
                            setIsOneTimeUse={setIsOneTimeUse}
                            booleanOptions={booleanOptions}
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
                <UpdateDiscount
                    discount={discount}
                    onClose={() => setShowUpdateModal(false)}
                />
            )}
        </div>
    )
}
export default Discount
