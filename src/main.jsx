import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import './index.css';
import Index from "./pages/Index.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </HashRouter>
);
