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
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import {useNavigate} from "react-router-dom";

const Discount = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [discount, setDiscount] = useState({});

    const [isActive, setIsActive] = useState('');
    const [isOneTimeUse, setIsOneTimeUse] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();

    const booleanOptions = ["YES", "NO"];

    const handleEdit = (item) => {
        setDiscount(item);
        setShowUpdateModal(true);
    }

    const statusStyles = {
        true: "bg-green-100 text-green-800",
        false: "bg-red-200 text-red-700",
    };

    const size = 20;

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


    const fetchData = async (page) => {
        // const res = await fetch(`/api/items?page=${page}`);
        // const { data, totalPages } = await res.json();

        setLoading(true);
        try {
            const startDateTime = startDate ? `${startDate}T00:00:00` : null;
            const endDateTime = endDate ? `${endDate}T23:59:59` : null;


            const request = {
                active: isActive === "YES" ? true : isActive === "NO" ? false : null,
                oneTimeUse: isOneTimeUse === "YES" ? true : isOneTimeUse === "NO" ? false : null,
                startDate: startDateTime,
                endDate: endDateTime,
            };
            // console.log(request);
            const res = await restClient.post(`/discount/filter?page=${page}&size=${size}`, request,navigate);
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

    const handleClose = () => {
        setShowUpdateModal(false)
        onSubmit();
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
                        <CreateDiscount
                            onClose={() => setShowCreateModal(false)}
                            onSubmit={onSubmit}
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
                    onClose={handleClose}
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
export default Discount
