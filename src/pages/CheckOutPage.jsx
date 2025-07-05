// pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import RoomListCheckbox from '../components/RoomListCheckbox';
import GuestSummary from '../components/GuestSummary';
import InvoiceModal from '../components/InvoiceModal';
import {logoImg} from "../utils/index.js";
import ConfirmModal from "../components/ConfirmModal.jsx";
import BackButton from "../components/BackButton.jsx";

const dummyData = {
    occupiedRooms: ['101', '102', '103'],
    roomGroups: {
        '101': ['101', '104'],
        '102': ['102'],
        '103': ['103', '105'],
    },
    guests: {
        '101': {
            name: 'John Doe',
            phone: '08012345678',
            totalPaid: 45000,
            balance: 15000,
            invoices: [
                {
                    serviceType: 'Room Service',
                    status: 'Paid',
                    date: '2025-07-04',
                    items: [
                        { name: 'Water', price: 200, quantity: 2 },
                        { name: 'Food', price: 1000, quantity: 1 },
                    ],
                    discount: 500,
                    subtotal: 2400,
                    amountPaid: 2400,
                },
                {
                    serviceType: 'Laundry',
                    status: 'Unpaid',
                    date: '2025-07-03',
                    items: [],
                    discount: 0,
                    subtotal: 1000,
                    amountPaid: 0,
                },
            ],
        },
        '102': {
            name: 'Jane Smith',
            phone: '08087654321',
            totalPaid: 60000,
            balance: 0,
            invoices: [],
        },
    },
};

const CheckoutPage = () => {
    const [selectedRoom, setSelectedRoom] = useState('');
    const [groupedRooms, setGroupedRooms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [showInvoice, setShowInvoice] = useState(false);
    const [guest, setGuest] = useState(null);
    const [invoices, setInvoices] = useState([]);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);

    useEffect(() => {
        if (selectedRoom && dummyData.roomGroups[selectedRoom]) {
            setGroupedRooms(dummyData.roomGroups[selectedRoom]);
            setSelectedRooms(dummyData.roomGroups[selectedRoom]);
            const guestData = dummyData.guests[selectedRoom];
            if (guestData) {
                setGuest(guestData);
                setInvoices(guestData.invoices);
            } else {
                setGuest(null);
                setInvoices([]);
            }
        }
    }, [selectedRoom]);

    const toggleRoom = (room) => {
        setSelectedRooms((prev) =>
            prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
        );
    };

    const handleCheckOut = (e) => {
        e.preventDefault();
        if (
            selectedRooms.length === 0
        ) {
            setShowMissingFields(true);
        }
        else{
            setShowConfirm(true);
        }
    };

    const confirmSubmission = () => {
        console.log('Submitting Check-Out:', { guest, selectedRooms});
        setShowConfirm(false);
    };

    return (
        <div>
            <BackButton/>

            <div className="flex justify-center items-center px-8 py-3 w-full">
                <form onSubmit={handleCheckOut} className="p-6 bg-white rounded-lg shadow-lg space-y-6 w-full">
                    <div className="flex space-x-12 justify-start py-5">
                        <img className="w-12 h-12" src={logoImg} alt="logo" />
                        <div className="flex justify-center w-5/6">
                            <h2 className="text-3xl font-semibold mb-4">Check-Out</h2>
                        </div>
                    </div>

                    {/* Room Selection */}
                    <div className="flex justify-start items-start space-x-12 w-max px-5">
                        <div className="flex flex-col items-start">
                            <label className="block mb-2">Select Room</label>
                            <select
                                className="input border mb-5"
                                value={selectedRoom}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                            >
                                <option value="">-- Select Room --</option>
                                {dummyData.occupiedRooms.map((room) => (
                                    <option key={room} value={room}>
                                        Room #{room}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className="flex flex-col items-start">
                            <p>Linked Rooms</p>
                            {groupedRooms.length > 0 && (
                                <RoomListCheckbox
                                    rooms={groupedRooms}
                                    selectedRooms={selectedRooms}
                                    toggleRoom={toggleRoom}
                                />
                            )}
                        </div>

                    </div>

                    <div className="flex justify-start py-4 text-start">
                        {/* Guest Summary */}
                        {guest && (
                            <GuestSummary
                                guest={guest}
                                totalPaid={guest.totalPaid}
                                balance={guest.balance}
                            />
                        )}
                    </div>

                    <div className="flex justify-between py-4">
                        {/* Invoice Popup Trigger */}
                        {guest && invoices.length > 0 && (
                            <div className="">
                                <button
                                    onClick={() => setShowInvoice(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    View Invoices ({invoices.length})
                                </button>
                            </div>
                        )}

                        {/* Checkout Button */}
                        {guest && (
                            <div className="">
                                <button
                                    onClick={() => handleCheckOut()}
                                    className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
                                >
                                    Confirm Check-Out
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
            {showInvoice && (
                <InvoiceModal
                    invoices={invoices}
                    onClose={() => setShowInvoice(false)}
                />
            )}

            {/* ✅ Confirm Modal */}
            {showConfirm && (
                <ConfirmModal
                    message="Confirm Check-Out?"
                    onConfirm={confirmSubmission}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {/* ✅ Missing Fields Modal */}
            {showMissingFields && (
                <ConfirmModal
                    message="No room selected"
                    onCancel={() => setShowMissingFields(false)}
                />
            )}

        </div>
    );
};

export default CheckoutPage;
