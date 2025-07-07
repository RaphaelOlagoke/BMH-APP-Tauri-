// pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import RoomListCheckbox from '../components/RoomListCheckbox';
import GuestSummary from '../components/GuestSummary';
import InvoiceModal from '../components/InvoiceModal';
import {getData, logoImg} from "../utils/index.js";
import ConfirmModal from "../components/ConfirmModal.jsx";
import BackButton from "../components/BackButton.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import {useNavigate} from "react-router-dom";
import restClient from "../utils/restClient.js";


const CheckoutPage = () => {
    const [selectedRoom, setSelectedRoom] = useState('');
    const [groupedRooms, setGroupedRooms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [showInvoice, setShowInvoice] = useState(false);
    const [guest, setGuest] = useState(null);
    const [invoices, setInvoices] = useState([]);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [occupiedRooms, setOccupiedRooms] = useState([]);
    const [modalMessage, setModalMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchRooms = async () => {
            try {
                const res = await restClient.get("/room/status?roomStatus=OCCUPIED",navigate);
                console.log(res)
                if(res.responseHeader.responseCode === "00") {
                    const roomData =  res.data;
                    setOccupiedRooms(roomData.map(room => room.roomNumber));
                }
                else{
                    setModalMessage(res.error ?? "Something went wrong!");
                    setShowMissingFields(true);
                }
            }
                // eslint-disable-next-line no-unused-vars
            catch (error) {
                setModalMessage("Something went wrong!");
                setShowMissingFields(true);
            }
            finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        const fetchGuestData = async () => {
            setLoading(true);
            const guestData = await getData(`/guestLog/find?roomNumber=${parseInt(selectedRoom)}`);

            setLoading(false);
            if(!guestData){
                setModalMessage("Something went wrong!");
                setShowMissingFields(true);
                return;
            }
            setGuest(guestData);
            setInvoices(guestData.invoices);
            setSelectedRooms(
                guestData.guestLogRooms
                    .filter(r => r.guestLogStatus === "ACTIVE")
                    .map(r => r.room.roomNumber)
            );
            setGroupedRooms(
                guestData.guestLogRooms
                    .filter(r => r.guestLogStatus === "ACTIVE")
                    .map(r => r.room.roomNumber)
            );
        };

        if(selectedRoom){
            fetchGuestData();
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
            setModalMessage("No rooms selected!");
            setShowMissingFields(true);
        }
        else{
            setShowConfirm(true);
        }
    };

    const confirmSubmission = async () => {
        console.log('Submitting Check-Out:', { guest, selectedRooms});

        setShowConfirm(false);
        setLoading(true);
        const checkOutRequest = {
            roomNumbers: selectedRooms,
        };

        try {
            const res = await restClient.post("/guestLog/check-out", checkOutRequest, navigate);
            console.log(res)
            if(res.responseHeader.responseCode === "00") {
                setShowSuccessModal(true);
            }
            else{
                setModalMessage(res.responseHeader.responseMessage ?? "Something went wrong!");
                setShowMissingFields(true);
            }
        }
            // eslint-disable-next-line no-unused-vars
        catch (error) {
            setModalMessage("Something went wrong!");
            setShowMissingFields(true);
        }
        finally {
            setLoading(false);
        }

    };

    const onSuccess = () => {
        setShowSuccessModal(false)
        navigate("/home")
    }

    return (
        <div>
            {loading && <LoadingScreen />}
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
                                {occupiedRooms.map((room) => (
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
                                totalPaid={guest.amountPaid}
                                balance={guest.creditAmount}
                            />
                        )}
                    </div>

                    <div className="flex justify-between py-4">
                        {/* Invoice Popup Trigger */}
                        {guest && invoices.length > 0 && (
                            <div className="">
                                <button
                                    type='button'
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
                                    type="button"
                                    onClick={handleCheckOut}
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
                    message={modalMessage}
                    onCancel={() => setShowMissingFields(false)}
                />
            )}

            {/* ✅ On Successful */}
            {showSuccessModal && (
                <ConfirmModal
                    message="Check Out Successful!"
                    onCancel={() => onSuccess()}
                />
            )}

        </div>
    );
};

export default CheckoutPage;
