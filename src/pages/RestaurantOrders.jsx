import React, {useEffect, useState} from 'react'
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import RestaurantOrdersFilter from "../components/RestaurantOrdersFilter.jsx";
import BackButton from "../components/BackButton.jsx";
import UpdateRestaurantOrder from "../Modals/UpdateRestaurantOrder.jsx";
import {useNavigate} from "react-router-dom";
import restClient, {BASE_URL} from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import {TABLE_SIZE} from "../utils/index.js";

const RestaurantOrders = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [search, setSearch] = useState("");

    const [selectedStatus, setSelectedStatus] = useState('');

    const statusOptions = ["IN_PROGRESS", "READY", "COMPLETED"];
    const updateStatusOptions = ["READY", "COMPLETED"];
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [orderItem, setOrderItem] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderStatus, setOrderStatus] = useState("");

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();
    const [blobUrl, setBlobUrl] = useState('');
    const [showBlobModal, setShowBlobModal] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const handleEdit = (item) => {
        setOrderItem(item);
        if (item.status === "IN_PROGRESS") {
            setOrderStatus("READY");
        }
        else{
            setOrderStatus("COMPLETED");
        }
        setShowUpdateModal(true);
    }

    async function downloadInvoice() {
        const ref = orderItem.invoice.ref;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8080/api/v1/invoice/download?ref=${ref}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/pdf',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch PDF');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Open PDF in new tab
            window.open(url, '_blank');
            openInSystemBrowser(url);
            setBlobUrl(`${BASE_URL}/invoice/download?ref=${ref}`);
            setShowBlobModal(true);

            // Optional: revoke the object URL later
            setTimeout(() => URL.revokeObjectURL(url), 5000);
        } catch (error) {
            console.error('Error opening PDF:', error);
            navigate('/login'); // or custom error handler
        }
    }

    function openInSystemBrowser(url) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
    const handlePrint = async () => {
        // console.log(`Printing Order ${orderItem.customerName}`);
        const ref = orderItem.invoice.ref;
        const token = localStorage.getItem('token');
        const url = `${BASE_URL}/invoice/download?ref=${ref}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/pdf'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch invoice');

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const printWindow = window.open(blobUrl, '_blank');

            if (!printWindow) {
                throw new Error('Popup blocked or failed to open');
            }

            // Wait until PDF is loaded, then print
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };

            // Optional: cleanup
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        } catch (err) {
            console.error('Print failed:', err);
            setModalMessage('Print failed');
            setShowModal(true);
        }
    }

    const handleUpdate = async () => {
       // console.log(`Updating Order ${orderItem.status} to ${orderStatus}`);
        setLoading(true);
        try {
            var endpoint = ""
            if(orderStatus === "READY"){
                endpoint = "markAsReady"
            }
            else if (orderStatus === "COMPLETED"){
                endpoint = "markAsComplete"
            }
            else{
                setModalMessage("No Staus selected");
                setShowModal(true);
            }
            if(endpoint){
                const res = await restClient.post(`/restaurant/order/${endpoint}?ref=${orderItem.ref}`, {}, navigate);
                // console.log("Add Room",res)
                if(res.responseHeader.responseCode === "00") {
                    setModalMessage("Item Updated");
                    setShowSuccessModal(true);
                }
                else{
                    setModalMessage(res.error ?? "Something went wrong!");
                    setShowModal(true);
                }
            }

        }
            // eslint-disable-next-line no-unused-vars
        catch (error) {
            setModalMessage("Something went wrong!");
            setShowModal(true);
        }
        finally {
            setLoading(false);
        }
    }

    const onSuccess = () => {
        setShowSuccessModal(false)
        setShowUpdateModal(false);
        onSubmit();
    }

    const statusStyles = {
        COMPLETED: "bg-green-100 text-green-800",
        IN_PROGRESS: "bg-yellow-200 text-yellow-700",
        READY: "bg-blue-200 text-blue-700",
        CANCELED: "bg-red-200 text-red-700",
    };

    const size = TABLE_SIZE;

    const columns = [
        { label: "Customer's Name", accessor: "customerName" },
        { label: "Order Ref", accessor: "ref" },
        { label: "Date", accessor: "createdDateTime" },
        { label: "Status", accessor: "status", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[value]}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
    ];

    const fetchData = async (page) => {
        // if(roomsList.length === 0){
        //     loadRoomSummaryData();
        // }
        setLoading(true);
        try {
            const startDateTime = startDate ? `${startDate}T00:00:00` : null;
            const endDateTime = endDate ? `${endDate}T23:59:59` : null;

            const request = {
                status: selectedStatus || null,
                startDate: startDateTime,
                endDate: endDateTime,
                customerName: search,
            }

            // console.log(request);

            const res = await restClient.post(`/restaurant/order/filter?page=${page}&size=${size}`, request,navigate);
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
            setModalMessage( "Something went wrong!");
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

    return (
        <div className="flex flex-col" >
            {loading && <LoadingScreen />}
            <BackButton/>

            <main className="main ps-20 py-6 mt-3 text-2xl w-full">
                <Header headerText="Hello Evano 👋🏼," />
                <Table
                    filterForm={
                        <RestaurantOrdersFilter
                            headerText="Restaurant Orders"
                            value={search}
                            onChange={setSearch}
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            onSubmit={onSubmit}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                            statusOptions={statusOptions}
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
                <UpdateRestaurantOrder
                    order={orderItem}
                    orderStatus={orderStatus}
                    setOrderStatus={setOrderStatus}
                    statusOptions={updateStatusOptions}
                    onClose={() => setShowUpdateModal(false)}
                    onPrint={handlePrint}
                    onSubmit={handleUpdate}
                    onDownload={downloadInvoice}
                />
            )}

            {showSuccessModal && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => onSuccess()}
                />
            )}

            {showModal && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => setShowModal(false)}
                />
            )}

            {showBlobModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Copy this link to open PDF in your browser</h3>
                        {linkCopied && (
                            <div className="mb-2 text-green-700 text-sm font-medium">
                                ✅ Link copied to clipboard!
                            </div>
                        )}

                        <input
                            type="text"
                            readOnly
                            value={blobUrl}
                            className="w-full border px-3 py-2 mb-4"
                            onFocus={e => e.target.select()}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(blobUrl);
                                    setLinkCopied(true);
                                    setTimeout(() => setLinkCopied(false), 3000);
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Copy Link
                            </button>
                            <button
                                onClick={() => setShowBlobModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default RestaurantOrders;
