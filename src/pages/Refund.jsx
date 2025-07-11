import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {
    menuItems, TABLE_SIZE
} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import CreateInvoice from "../Modals/CreateInvoice.jsx";
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import {useNavigate} from "react-router-dom";
import RefundFilter from "../components/RefundFilter.jsx";
import CreateRefund from "../Modals/CreateRefund.jsx";

const Refund = () => {

    const [tableSearchTerm, SetTableSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    // const [showUpdateModal, setShowUpdateModal] = useState(false);
    // const [refund, setRefund] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState(false);
    const navigate = useNavigate();

    const size = TABLE_SIZE;

    const columns = [
        { label: "Refund Ref", accessor: "ref" },
        { label: "Date", accessor: "date" },
        { label: "Amount", accessor: "amount"},
        { label: "Reason", accessor: "reason"},
        { label: "Invoice Ref", accessor: "invoice",  render: (value) => (value.ref)},
    ];


    const fetchData = async (page) => {
        // const res = await fetch(`/api/items?page=${page}`);
        // const { data, totalPages } = await res.json();
        setLoading(true);
        try {
            const startDateTime = startDate ? `${startDate}T00:00:00` : null;
            const endDateTime = endDate ? `${endDate}T23:59:59` : null;

            const res = await restClient.post(`/refund/filter?page=${page}&size=${size}`, {
                startDate: startDateTime,
                endDate: endDateTime,
                query: tableSearchTerm,
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

    // const handleEdit = (item) => {
    //     setRefund(item);
    //     setShowUpdateModal(true);
    // }

    // const handleClose = () => {
    //     setShowUpdateModal(false)
    //     onSubmit();
    // }


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
                        <CreateRefund
                            onClose={() => setShowCreateModal(false)}
                            onSubmit={onSubmit}
                        />
                    )}
                </div>
                <Table
                    filterForm={
                        <RefundFilter
                            headerText="Refunds"
                            value={tableSearchTerm}
                            onChange={SetTableSearchTerm}
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            onSubmit={onSubmit}
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

            {/*{showUpdateModal && (*/}
            {/*    <InvoiceModal*/}
            {/*        invoices={[invoice]}*/}
            {/*        onClose={handleClose}*/}
            {/*    />*/}
            {/*)}*/}

            {showModal && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    )
}
export default Refund;
