import React, {useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import '../index.css';
import logo from "/assets/images/Logo.png";
import {
    LogIn
} from 'lucide-react';
import restClient from "../utils/restClient.js";
import LoadingScreen from "./LoadingScreen.jsx";


const Sidebar = ({ menuItems }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const logout = async () => {
        setLoading(true);
        try {
            await restClient.postWithoutToken('/auth/logout', {});
        } catch (err) {
            console.error("Logout request failed:", err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            setLoading(false);
        }
    };

    const user = JSON.parse(localStorage.getItem('user'));
    const filteredMenuItems = menuItems.filter(item =>
        !item.roles || item.roles.includes(user?.department)
    );

    return (
        <div className="min-w-64  bg-gray-800 text-white flex flex-col p-4 shadow-lg rounded-r-lg min-h-dvh ">
            {loading && <LoadingScreen />}
            <div className="flex justify-center pb-5">
                <img className="w-12 h-12" src={logo} alt="logo" />
            </div>
            <nav className="flex flex-col justify-between overflow-y-scroll scrollbar-hide">
                <div className="flex flex-col space-y-2 ">
                    {filteredMenuItems.map(({ label, icon: Icon, path }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-3 px-3 py-2 rounded transition-all duration-200 ${
                                location.pathname === path
                                    ? 'bg-gray-600 text-white'
                                    : 'hover:bg-gray-700 text-white'
                            }`}
                        >
                            {Icon ? <Icon size={18} /> : <span>❓</span>}
                            {label}
                        </Link>
                    ))}
                </div>

                <div className="pt-6">
                    <button
                        onClick={logout}
                        className={`flex items-center gap-3 px-3 py-2 rounded transition-all hover:bg-gray-700 text-white`}
                    >
                        <LogIn size={18} />
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
