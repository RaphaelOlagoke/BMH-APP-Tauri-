import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {
    expensesInvoiceImg,
    menuItems,
    paidInvoiceImg, syncInvoiceImg, unpaidInvoiceImg
} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import InventoryFilter from "../components/InventoryFilter.jsx";
import UpdateInventory from "../Modals/UpdateInventory.jsx";
import CreateInventory from "../Modals/CreateInventory.jsx";
import InvoiceFilter from "../components/InvoiceFilter.jsx";
import CreateInvoice from "../Modals/CreateInvoice.jsx";
import InvoiceModal from "../components/InvoiceModal.jsx";
import InfoMenu from "../components/InfoMenu.jsx";

const Invoice = () => {


    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
    const [tableSearchTerm, SetTableSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [invoice, setInvoice] = useState({});


    const paymentMethodOptions = ["CARD", "CASH", "TRANSFER", "NONE"];

    const paymentStatusOptions = ["UNPAID", "PAID", "DEBIT", "REFUNDED"];

    const serviceOptions = ["ROOM", "RESTAURANT_BAR", "MAINTENANCE"];

    const totalPages = 20;

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

    const invoiceSummary = [
        { label: 'PAID', image: paidInvoiceImg, count: "5" , value: 100000},
        { label: 'UNPAID', image: unpaidInvoiceImg, count: "5" , value: 15000},
        { label: 'EXPENSES', image: expensesInvoiceImg, count: "1" , value: 1000},
        { label: 'REFUNDED', image: syncInvoiceImg, count: "1" , value: 1000},
        { label: 'CREDIT', image: syncInvoiceImg, count: "1" , value: 1000}
    ];

    const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    });

    const formattedInvoiceSummary = invoiceSummary.map(item => ({
        ...item,
        formattedValue: formatter.format(item.value)
    }));

    console.log(formattedInvoiceSummary);

    const dataList = [
        {
            ref: "INV001",
            issueDate: "2025-07-01T10:00:00",
            paymentDate: "2025-07-01T10:30:00",
            totalAmount: 250.0,
            paymentStatus: "PAID",           // PaymentStatus enum
            paymentMethod: "CARD",    // PaymentMethod enum
            service: "ROOM_BOOKING",         // ServiceType enum
            serviceDetails: "Deluxe Room Booking - 2 nights",
            discountCode: "SUMMER10",
            discountPercentage: 10,
            discountAmount: 25.0,
            amountPaid: 225.0,
            items: [
                { name: "Deluxe Room", quantity: 2, price: 100.0 },
                { name: "Service Charge", quantity: 1, price: 50.0 }
            ]
        },
        {
            ref: "INV002",
            issueDate: "2025-07-03T14:15:00",
            paymentDate: null,
            totalAmount: 120.0,
            paymentStatus: "PAID",
            paymentMethod: "CASH",
            service: "RESTAURANT_BAR",
            serviceDetails: "Dinner for 2 at Rooftop Restaurant",
            discountCode: null,
            discountPercentage: 0,
            discountAmount: 0.0,
            amountPaid: 0.0,
            items: [
                { name: "Grilled Salmon", quantity: 2, price: 40.0 },
                { name: "Wine Bottle", quantity: 1, price: 40.0 }
            ]
        },
        {
            ref: "INV003",
            issueDate: "2025-07-04T08:00:00",
            paymentDate: "2025-07-04T08:45:00",
            totalAmount: 80.0,
            paymentStatus: "PAID",
            paymentMethod: "TRANSFER",
            service: "ROOM",
            serviceDetails: "Laundry service - 5 items",
            discountCode: "CLEAN5",
            discountPercentage: 5,
            discountAmount: 4.0,
            amountPaid: 76.0,
            items: [
                { name: "Shirt", quantity: 3, price: 10.0 },
                { name: "Trousers", quantity: 2, price: 25.0 }
            ]
        },
        {
            ref: "INV004",
            issueDate: "2025-07-05T11:30:00",
            paymentDate: null,
            totalAmount: 300.0,
            paymentStatus: "REFUNDED",
            paymentMethod: "TRANSFER",
            service: "ROOM",
            serviceDetails: "Conference room for business meeting",
            discountCode: null,
            discountPercentage: 0,
            discountAmount: 0.0,
            amountPaid: 0.0,
            items: [
                { name: "Conference Room Booking", quantity: 1, price: 300.0 }
            ]
        },
        {
            ref: "INV005",
            issueDate: "2025-07-05T15:00:00",
            paymentDate: "2025-07-05T15:45:00",
            totalAmount: 50.0,
            paymentStatus: "PAID",
            paymentMethod: "CASH",
            service: "ROOM",
            serviceDetails: "Swedish Massage - 60 minutes",
            discountCode: "RELAX15",
            discountPercentage: 15,
            discountAmount: 7.5,
            amountPaid: 42.5,
            items: [
                { name: "Swedish Massage", quantity: 1, price: 50.0 }
            ]
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
        setInvoice(item);
        setShowUpdateModal(true);
    }


    return (
        <div className="flex" >
            <Sidebar menuItems={menuItems}/>

            <main className="main ps-20 py-6 mt-3 text-2xl w-full">
                <Header headerText="Hello Evano 👋🏼," />
                <InfoMenu menuItems={formattedInvoiceSummary}/>
                <div className="p-4 my-3 me-3">
                    <div className="flex justify-end mb-4">
                        <CreateButton onClick={() => setShowCreateModal(true)} />
                    </div>

                    {showCreateModal && (
                        <CreateInvoice
                            paymentMethodOptions ={paymentMethodOptions}
                            serviceOptions={serviceOptions}
                            paymentStatusOptions = {paymentStatusOptions}
                            onClose={() => setShowCreateModal(false)}
                        />
                    )}
                </div>
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
                    onClose={() => setShowUpdateModal(false)}
                />
            )}
        </div>
    )
}
export default Invoice;
