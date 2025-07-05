import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import './index.css';
import Index from "./pages/Index.jsx";
import CheckInForm from "./pages/CheckInForm.jsx";
import CheckOutPage from "./pages/CheckOutPage.jsx";
import SingleGuestLog from "./pages/SingleGuestLog.jsx";
import RoomReservation from "./pages/RoomReservation.jsx";
import HallReservation from "./pages/HallReservation.jsx";
import SingleHallReservation from "./pages/SingleHallReservation.jsx";
import Rooms from "./pages/Rooms.jsx";
import SingleRoom from "./pages/SingleRoom.jsx";
import RoomService from "./pages/RoomService.jsx";
import Inventory from "./pages/Inventory.jsx";
import InventoryHistory from "./pages/InventoryHistory.jsx";
import HouseKeeping from "./pages/HouseKeeping.jsx";
import Invoice from "./pages/Invoice.jsx";
import Discount from "./pages/Discount.jsx";
import User from "./pages/User.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/check-in" element={<CheckInForm />} />
            <Route path="/check-out" element={<CheckOutPage />} />
            <Route path="/guest-log/:id" element={<SingleGuestLog />} />
            <Route path="/room-reservation" element={<RoomReservation />} />
            <Route path="/hall-reservation" element={<HallReservation />} />
            <Route path="/hall-reservation/:id" element={<SingleHallReservation />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<SingleRoom />} />
            <Route path="/room-service" element={<RoomService />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory-history" element={<InventoryHistory />} />
            <Route path="/house-keeping" element={<HouseKeeping />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/discount" element={<Discount />} />
            <Route path="/users" element={<User />} />
            <Route path="/settings" element={<SettingsPage />} />
        </Routes>
    </HashRouter>
);
