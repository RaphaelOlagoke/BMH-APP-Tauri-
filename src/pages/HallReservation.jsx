import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {
    HALL_STATUS,
    HALL_TYPES,
    ID_TYPES,
    menuItems,
    PAYMENT_METHODS,
    PAYMENT_STATUS,
    TABLE_SIZE
} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import CreateReservation from "../Modals/CreateReservation.jsx";
import HallReservationFilter from "../components/HallReservationFilter.jsx";
import CreateHallReservation from "../Modals/CreateHallReservation.jsx";
import {useNavigate} from "react-router-dom";
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";

const HallReservation = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedHall, setSelectedHall] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
    const [hallTypes, setHallTypes] = useState([]);

    const hallOptions = HALL_TYPES;
    const statusOptions = HALL_STATUS;
    const paymentStatusOptions = PAYMENT_STATUS;


    useEffect(() => {
        const fetchHallPrices = async () => {
            setLoading(true);
            try {
                const res = await restClient.get("/hallPrices/all",navigate);
                // console.log(res)
                if(res.responseHeader.responseCode === "00") {
                   const data = res.data;
                   // console.log(data)
                    setHallTypes([
                        { type: 'CONFERENCE_ROOM', price: data.conferenceHallPrice },
                        { type: 'MEETING_ROOM', price: data.meetingRoomPrice },
                        { type: 'MEETING_HALL', price: data.meetingHallPrice }
                    ])
                }
            }
                // eslint-disable-next-line no-unused-vars
            catch (error) {
                setModalMessage("Something went wrong!")
                setShowModal(true)
            }
            finally {
                setLoading(false);
            }
        }
        fetchHallPrices();
    }, [])

    const idTypes = ID_TYPES;

    const paymentMethods = PAYMENT_METHODS;



    // const navigate = useNavigate();
    const statusStyles = {
        ACTIVE: "bg-green-100 text-green-800",
        COMPLETE: "bg-blue-200 text-blue-700",
        UPCOMING: "bg-yellow-200 text-yellow-700",
        CANCELED: "bg-red-200 text-red-700",
    };

    const columns = [
        { label: "Guest Name", accessor: "guestName" },
        { label: "Phone number", accessor: "phoneNumber" },
        { label: "Hall", accessor: "hall" },
        { label: "Status", accessor: "status", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[value]}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
        { label: "Start Date", accessor: "startDate",
            render: (value) => (
                value
                    ? ((d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)(new Date(value)))
                    : "-"
            )},
        { label: "End Date", accessor: "endDate",
            render: (value) => (
                value
                    ? ((d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)(new Date(value)))
                    : "-"
            )},
        { label: "Payment Status", accessor: "paymentStatus", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-200 text-red-700'}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
            )},
    ];

    const size = TABLE_SIZE;

    const fetchData = async (page) => {
        // const res = await fetch(`/api/items?page=${page}`);
        // const { data, totalPages } = await res.json();

        setLoading(true);
        try {
            const startDateTime = startDate ? `${startDate}T00:00:00` : null;
            const endDateTime = endDate ? `${endDate}T23:59:59` : null;
            const res = await restClient.post(`/hallLog/filter?page=${page}&size=${size}`, {
                status: selectedStatus || null,
                paymentStatus: selectedPaymentStatus || null,
                startDate: startDateTime,
                endDate: endDateTime,
                hallType: selectedHall || null,
            },navigate);
            // console.log("Hall Data",res)
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
        setPage(0);
        fetchData(page)
    };


    const handleSubmitReservation = (data) => {
        console.log('Hall Reservation Submitted:', data);
        setPage(0);
        fetchData(page)
    };


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
                        <CreateHallReservation
                            hallTypes={hallTypes}
                            idTypes={idTypes}
                            paymentMethods={paymentMethods}
                            onSubmit={handleSubmitReservation}
                            onClose={() => setShowCreateModal(false)}
                        />
                    )}
                </div>
                <Table
                    filterForm={
                        <HallReservationFilter
                            headerText="Hall Reservations"
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            onSubmit={onSubmit}
                            selectedHall={selectedHall}
                            setSelectedHall={setSelectedHall}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                            selectedPaymentStatus={selectedPaymentStatus}
                            setSelectedPaymentStatus={setSelectedPaymentStatus}
                            hallOptions={hallOptions}
                            statusOptions={statusOptions}
                            paymentStatusOptions={paymentStatusOptions}
                        />
                    }
                    columns={columns}
                    data={data}
                    currentPage={page}
                    totalPages={pageCount}
                    onPageChange={handlePageChange}
                    onEdit={(hall) => navigate(`/hall-reservation/${hall.ref}`, { state: { hall } })}
                    showEdit={true}
                />
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold mb-4">Notice</h2>
                        <p className="text-sm text-gray-700 mb-6">{modalMessage}</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
export default HallReservation
