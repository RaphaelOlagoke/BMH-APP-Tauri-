import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../index.css';
import logo from "/assets/images/Logo.png";
import {
    LogIn
} from 'lucide-react';


const Sidebar = ({ menuItems }) => {
    const location = useLocation();

    return (
        <div className="w-72 h-screen bg-white text-black flex flex-col p-4 shadow-lg rounded-r-lg">
            <div className="flex justify-center pb-5">
                <img className="w-12 h-12" src={logo} alt="logo" />
            </div>
            <nav className="flex flex-col justify-between overflow-y-scroll scrollbar-hide">
                <div className="flex flex-col space-y-2 ">
                    {menuItems.map(({ label, icon: Icon, path }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-3 px-3 py-2 rounded transition-all duration-200 ${
                                location.pathname === path
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-blue-100 text-black'
                            }`}
                        >
                            {Icon ? <Icon size={18} /> : <span>❓</span>}
                            {label}
                        </Link>
                    ))}
                </div>

                <div className="pt-6">
                    <Link
                        to="/logout"
                        className={`flex items-center gap-3 px-3 py-2 rounded transition-all hover:bg-blue-100 text-black`}
                    >
                        <LogIn size={18} />
                        Logout
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
