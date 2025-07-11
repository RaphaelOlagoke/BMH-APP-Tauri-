import React, {useEffect, useState} from 'react'
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Table from "../components/Table.jsx";
import {menuItems, TABLE_SIZE} from "../utils/index.js";
import CreateButton from "../components/CreateButton.jsx";
import UserFilter from "../components/UserFilter.jsx";
import UpdateUser from "../Modals/UpdateUser.jsx";
import CreateUser from "../Modals/CreateUser.jsx";
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import {useNavigate} from "react-router-dom";

const User = () => {
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [user, setUser] = useState({});

    const [isActive, setIsActive] = useState('');
    const [userAccess, setUserAccess] = useState('');
    const [userRole, setUserRole] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState(false);
    const navigate = useNavigate();

    const handleEdit = (item) => {
        setUser(item);
        setShowUpdateModal(true);
    }

    const statusStyles = {
        true: "bg-green-100 text-green-800",
        false: "bg-red-200 text-red-700",
    };

    const size = TABLE_SIZE;

    const userAccessOptions = ["RECEPTIONIST", "RESTAURANT_BAR", "ACCOUNTS", "MANAGER", "SUPER_ADMIN"];
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


    const fetchData = async (page) => {
        // const res = await fetch(`/api/items?page=${page}`);
        // const { data, totalPages } = await res.json();

        setLoading(true);
        try {

            const request = {
                role: userRole || null,
                enabled: isActive === "true" ? true : isActive === "false" ? false : null,
                department: userAccess || null
            };
            // console.log(request);
            const res = await restClient.post(`/admin/filter?page=${page}&size=${size}`, request,navigate);
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


    return (
        <div className="flex" >
            {loading && <LoadingScreen />}
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
                            onSubmit={onSubmit}
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
export default User
