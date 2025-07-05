import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {menuItems} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import UserFilter from "../components/UserFilter.jsx";
import UpdateUser from "../Modals/UpdateUser.jsx";
import CreateUser from "../Modals/CreateUser.jsx";

const User = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [user, setUser] = useState({});

    const [isActive, setIsActive] = useState('');
    const [userAccess, setUserAccess] = useState('');
    const [userRole, setUserRole] = useState('');

    const handleEdit = (item) => {
        setUser(item);
        setShowUpdateModal(true);
    }

    const statusStyles = {
        true: "bg-green-100 text-green-800",
        false: "bg-red-200 text-red-700",
    };

    const totalPages = 20;

    const userAccessOptions = ["RECEPTIONIST", "RESTAURANT_BAR", "ADMIN", "ACCOUNTS", "MANAGER", "SUPER_ADMIN"];
    const userRoleOptions = ["USER", "ADMIN", "SUPER_ADMIN"];

    const columns = [
        { label: "Email", accessor: "email" },
        { label: "Username", accessor: "username" },
        { label: "Role", accessor: "role" },
        { label: "Access", accessor: "department" },
        { label: "Is Active", accessor: "enabled", render: (value) => (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[value]} `}>
                {value ? "Yes" : "No"}
            </span>
            )},
        { label: "Created By", accessor: "createdBy" },
        { label: "Date Created", accessor: "createdDateTime" },
        { label: "Last Modified By", accessor: "lastModifiedBy" },
        { label: "Date Modified", accessor: "lastModifiedDateTime" }
    ];

    const dataList = [
        {
            email: "admin@example.com",
            username: "adminUser",
            password: "AdminPass123!",
            role: "ADMIN",
            enabled: true,
            department: "ACCOUNTS",
            createdBy: "system",
            lastModifiedBy: "adminUser",
            createdDateTime: "2025-06-01T08:00:00",
            lastModifiedDateTime: "2025-07-01T10:15:00"
        },
        {
            email: "john.doe@example.com",
            username: "jdoe",
            password: "JDoe#456",
            role: "USER",
            enabled: true,
            department: "RECEPTIONIST",
            createdBy: "adminUser",
            lastModifiedBy: "adminUser",
            createdDateTime: "2025-06-05T09:30:00",
            lastModifiedDateTime: "2025-06-20T11:00:00"
        },
        {
            email: "jane.smith@example.com",
            username: "jsmith",
            password: "JanePwd789!",
            role: "USER",
            enabled: false,
            department: "RESTAURANT_BAR",
            createdBy: "adminUser",
            lastModifiedBy: "jdoe",
            createdDateTime: "2025-06-10T10:45:00",
            lastModifiedDateTime: "2025-06-30T12:20:00"
        },
        {
            email: "chef.mario@example.com",
            username: "chefMario",
            password: "MarioCooks99",
            role: "USER",
            enabled: true,
            department: "RESTAURANT_BAR",
            createdBy: "adminUser",
            lastModifiedBy: "jsmith",
            createdDateTime: "2025-06-12T14:10:00",
            lastModifiedDateTime: "2025-07-03T09:00:00"
        },
        {
            email: "manager.lisa@example.com",
            username: "lisaManager",
            password: "Manager$123",
            role: "ADMIN",
            enabled: true,
            department: "MANAGER",
            createdBy: "system",
            lastModifiedBy: "lisaManager",
            createdDateTime: "2025-06-01T08:30:00",
            lastModifiedDateTime: "2025-07-01T08:30:00"
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

            <main className="main ps-10 py-6 mt-3 text-2xl overflow-x-scroll">
                <Header headerText="Hello Evano 👋🏼," />
                <div className="p-4 my-3 me-3">
                    <div className="flex justify-end mb-4">
                        <CreateButton onClick={() => setShowCreateModal(true)} />
                    </div>

                    {showCreateModal && (
                        <CreateUser
                            userAccessOptions ={userAccessOptions}
                            userRoleOptions = { userRoleOptions}
                            onClose={() => setShowCreateModal(false)}
                        />
                    )}
                </div>
                <Table
                    filterForm={
                        <UserFilter
                            headerText="Users"
                            isActive = {isActive}
                            setIsActive = {setIsActive}
                            userAccess = {userAccess}
                            setUserAccess = {setUserAccess}
                            userRole = {userRole}
                            setUserRole = {setUserRole}
                            onSubmit = {onSubmit}
                            userAccessOptions = {userAccessOptions}
                            userRoleOptions = {userRoleOptions}
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
                <UpdateUser
                    user={user}
                    userAccessOptions ={userAccessOptions}
                    userRoleOptions = { userRoleOptions}
                    onClose={() => setShowUpdateModal(false)}
                />
            )}
        </div>
    )
}
export default User
