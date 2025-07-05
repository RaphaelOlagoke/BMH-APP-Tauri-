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
        </Routes>
    </HashRouter>
);
