import React, {useEffect, useState} from 'react'
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import RestaurantOrdersFilter from "../components/RestaurantOrdersFilter.jsx";
import BackButton from "../components/BackButton.jsx";
import UpdateRestaurantOrder from "../Modals/UpdateRestaurantOrder.jsx";

const RestaurantOrders = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [selectedStatus, setSelectedStatus] = useState('');

    const statusOptions = ["IN_PROGRESS", "READY", "COMPLETED", "CANCELED"];
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [orderItem, setOrderItem] = useState({});
    const [orderStatus, setOrderStatus] = useState({});

    const handleEdit = (item) => {
        setOrderItem(item);
        setOrderStatus(item.status);
        setShowUpdateModal(true);
    }

    const handlePrint = () => {
        console.log(`Printing Order ${orderItem.customerName}`);
    }

    const handleUpdate = () => {
       console.log(`Updating Order ${orderItem.status} to ${orderStatus}`);
    }

    const statusStyles = {
        COMPLETED: "bg-green-100 text-green-800",
        IN_PROGRESS: "bg-yellow-200 text-yellow-700",
        READY: "bg-blue-200 text-blue-700",
        CANCELED: "bg-red-200 text-red-700",
    };

    const totalPages = 20;

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

    const dataList = [
        {
            ref: "g1",
            customerName: "John Doe",
            status: "IN_PROGRESS",
            items: [
                { name: "Fried Rice", quantity: 2, price: 2500.0 },
                { name: "Chicken", quantity: 1, price: 3000.0 }
            ],
            invoice: {
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
            createdDateTime: "2025-06-28T12:00:00"
        },
        {
            ref: "g2",
            customerName: "Mary Smith",
            status: "COMPLETED",
            items: [
                { name: "Pasta", quantity: 1, price: 4000.0 },
                { name: "Juice", quantity: 2, price: 1500.0 }
            ],
            invoice: null,
            createdDateTime: "2025-06-28T13:30:00"
        },
        {
            ref: "g3",
            customerName: "Alice Johnson",
            status: "IN_PROGRESS",
            items: [
                { name: "Steak", quantity: 2, price: 7000.0 },
                { name: "Wine", quantity: 1, price: 12000.0 }
            ],
            invoice: null,
            createdDateTime: "2025-06-28T15:45:00"
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
                <Header headerText="Hello Evano 👋🏼," />
                <Table
                    filterForm={
                        <RestaurantOrdersFilter
                            headerText="Restaurant Orders"
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
                    statusOptions={statusOptions}
                    onClose={() => setShowUpdateModal(false)}
                    onPrint={handlePrint}
                    onSubmit={handleUpdate}
                />
            )}
        </div>
    )
}
export default RestaurantOrders;
