import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {
    expensesInvoiceImg, getUser, menuItems, paidInvoiceImg, syncInvoiceImg, unpaidInvoiceImg
} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import InvoiceFilter from "../components/InvoiceFilter.jsx";
import CreateInvoice from "../Modals/CreateInvoice.jsx";
import InvoiceModal from "../components/InvoiceModal.jsx";
import InfoMenu from "../components/InfoMenu.jsx";
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import {useNavigate} from "react-router-dom";

const Invoice = () => {


    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
    const [tableSearchTerm, SetTableSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [invoice, setInvoice] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();
    const [invoiceSummary, setInvoiceSummary] = useState([]);
    const [formattedInvoiceSummary, setFormattedInvoiceSummary] = useState([]);


    const paymentMethodOptions = ["CARD", "CASH", "TRANSFER", "NONE"];

    const paymentStatusOptions = ["UNPAID", "PAID", "DEBIT", "REFUNDED"];

    const serviceOptions = ["ROOM", "RESTAURANT_BAR", "MAINTENANCE"];

    const size = 20;

    const statusStyles = {
        PAID: "bg-green-100 text-green-800",
        UNPAID: "bg-yellow-200 text-yellow-700",
        REFUNDED: "bg-blue-200 text-blue-700",
        DEBIT: "bg-red-200 text-red-700",
    };

    const columns = [
        { label: "Invoice Ref", accessor: "ref" },
        { label: "Issue Date", accessor: "issueDate" },
        { label: "Payment Date", accessor: "paymentDate"},
        { label: "Payment Method", accessor: "paymentMethod"},
        { label: "Payment Status", accessor: "paymentStatus", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[value]} `}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
        { label: "Service", accessor: "service"},
        { label: "Total Amount", accessor: "totalAmount"},
        { label: "Amount Paid", accessor: "amountPaid"},
    ];

    const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    });


    const loadInvoiceSummaryData = async () => {
        setLoading(true);
        try {
            const startDateTime = startDate ? `${startDate}T00:00:00` : null;
            const endDateTime = endDate ? `${endDate}T23:59:59` : null;
            const request = {
                paymentMethod: selectedPaymentMethod || null,
                service: selectedService || null,
                paymentStatus: selectedPaymentStatus || null,
                startDate: startDateTime,
                endDate: endDateTime,
                query: tableSearchTerm
            }
            const res = await restClient.post('/invoice/invoiceSummary', request,navigate);
            if(res.data && res.responseHeader.responseCode === "00") {
                const data = res.data;
                setInvoiceSummary([
                    { label: 'PAID', image: paidInvoiceImg, count: data.noOfPaidInvoice , value: data.totalValueOfPaidInvoice},
                    { label: 'UNPAID', image: unpaidInvoiceImg, count: data.noOfUnPaidInvoice , value: data.totalValueOfUnPaidInvoice},
                    { label: 'EXPENSES', image: expensesInvoiceImg, count: data.noOfDebitInvoice , value: data.totalValueOfDebitInvoice},
                    { label: 'REFUNDED', image: syncInvoiceImg, count: data.noOfRefundedInvoice , value: data.totalValueOfRefundedInvoice},
                    { label: 'CREDIT', image: syncInvoiceImg, count: data.noOfCreditInvoice , value: data.totalValueOfCreditInvoice}
                ]);
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

    const fetchData = async (page) => {
        // const res = await fetch(`/api/items?page=${page}`);
        // const { data, totalPages } = await res.json();
        setLoading(true);
        try {
            const startDateTime = startDate ? `${startDate}T00:00:00` : null;
            const endDateTime = endDate ? `${endDate}T23:59:59` : null;

            const res = await restClient.post(`/invoice/filter?page=${page}&size=${size}`, {
                paymentMethod: selectedPaymentMethod || null,
                service: selectedService || null,
                paymentStatus: selectedPaymentStatus || null,
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

    useEffect(() => {
        loadInvoiceSummaryData();
    },[])

    useEffect(() => {
        setFormattedInvoiceSummary(invoiceSummary.map(item => ({
            ...item,
            formattedValue: formatter.format(item.value)
        })));
    }, [invoiceSummary]);


    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage <= pageCount) {
            setPage(newPage);
        }
    };

    const onSubmit = async () => {
        setPage(0);
        await loadInvoiceSummaryData();
        await fetchData(page)
    };

    const handleEdit = (item) => {
        setInvoice(item);
        setShowUpdateModal(true);
    }

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

                    {showCreateModal && getUser().department === "SUPER_ADMIN" && (
                        <CreateInvoice
                            paymentMethodOptions ={paymentMethodOptions}
                            serviceOptions={serviceOptions}
                            paymentStatusOptions = {paymentStatusOptions}
                            onClose={() => setShowCreateModal(false)}
                            onSubmit={onSubmit}
                        />
                    )}
                </div>
                <InfoMenu menuItems={formattedInvoiceSummary}/>
                <Table
                    filterForm={
                        <InvoiceFilter
                            headerText="Invoice"
                            value={tableSearchTerm}
                            onChange={SetTableSearchTerm}
                            selectedPaymentMethod = {selectedPaymentMethod}
                            setSelectedPaymentMethod = {setSelectedPaymentMethod}
                            selectedService = {selectedService}
                            setSelectedService = {setSelectedService}
                            selectedPaymentStatus = {selectedPaymentStatus}
                            setSelectedPaymentStatus = {setSelectedPaymentStatus}
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            onSubmit={onSubmit}
                            paymentMethodOptions = {paymentMethodOptions}
                            paymentStatusOptions = {paymentStatusOptions}
                            serviceOptions = {serviceOptions}
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
                <InvoiceModal
                    invoices={[invoice]}
                    onClose={handleClose}
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
export default Invoice;
