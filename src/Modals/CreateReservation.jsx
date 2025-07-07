import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import ConfirmModal from "../components/ConfirmModal.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import {useNavigate} from "react-router-dom";
import restClient from "../utils/restClient.js";


const CreateReservation = ({
      roomTypes = [],
      availableRooms = {},
      onClose,
    onSubmit
  }) => {
    const [guest, setGuest] = useState({ name: '', phone: '' });
    const [roomType, setRoomType] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");


    const handleGuestChange = (e) => {
        const { name, value } = e.target;
        setGuest((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddRoom = () => {
        if (
            selectedRoom &&
            roomType &&
            !selectedRooms.some((r) => r.room === selectedRoom)
        ) {
            const price = roomTypes.find((rt) => rt.type === roomType)?.price || 0;
            setSelectedRooms((prev) => [
                ...prev,
                { type: roomType, room: selectedRoom, price },
            ]);
            setSelectedRoom('');
        }
    };

    const handleRemoveRoom = (room) => {
        setSelectedRooms((prev) => prev.filter((r) => r.room !== room));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!guest.name || !guest.phone || selectedRooms.length === 0) {
            setModalMessage("Please fill all required fields")
            setShowMissingFields(true);
        }
        else{
            setShowConfirm(true);
        }
    };

    const confirmSubmission = async () => {
        setShowConfirm(false);
        setLoading(true);
        const createReservationRequest = {
            guestName: guest.name,
            roomNumbers: selectedRooms.map(r => r.room),
            phoneNumber: guest.phone
        };
        console.log(createReservationRequest);
        try {
            const res = await restClient.post("/reservation/", createReservationRequest, navigate);
            console.log(res)
            if(res.data && res.responseHeader.responseCode === "00") {
                setShowSuccessModal(true);
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

    const onSuccess = () => {
        setShowSuccessModal(false)
        onClose();
        onSubmit();
    }

    const totalPrice = selectedRooms.reduce((sum, r) => sum + r.price, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            {loading && <LoadingScreen />}
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-3xl p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create Reservation</h2>
                    <button type="button" onClick={onClose}>
                        <X className="text-red-600" />
                    </button>
                </div>

                {/* Guest Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                        name="name"
                        value={guest.name}
                        onChange={handleGuestChange}
                        placeholder="Guest Name"
                        className="input border px-4 py-2 rounded text-xl"
                    />
                    <input
                        name="phone"
                        value={guest.phone}
                        onChange={handleGuestChange}
                        placeholder="Phone Number"
                        className="input border px-4 py-2 rounded text-xl"
                    />
                </div>

                {/* Room Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <select
                        value={roomType}
                        onChange={(e) => {
                            const type = e.target.value;
                            setRoomType(type);
                            const price = roomTypes.find((r) => r.type === type)?.price || 0;
                            setCurrentPrice(price);
                        }}
                        className="border px-4 py-2 rounded text-xl"
                    >
                        <option value="">Room Type</option>
                        {roomTypes.map((r) => (
                            <option key={r.type} value={r.type}>
                                {r.type}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="border px-4 py-2 rounded text-xl"
                    >
                        <option value="">Select Room</option>
                        {(availableRooms[roomType] || []).map((room) => (
                            <option key={room} value={room}>
                                {room}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={handleAddRoom}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add Room
                    </button>
                </div>

                {/* Selected Rooms List */}
                {selectedRooms.length > 0 && (
                    <div className="border p-4 rounded bg-gray-50 mb-6">
                        <h3 className="font-semibold mb-2">Selected Rooms:</h3>
                        <ul className="space-y-1">
                            {selectedRooms.map((room, idx) => (
                                <li key={idx} className="flex justify-between items-center text-xl">
                  <span>
                    {room.type} Room - #{room.room} - ₦{room.price.toLocaleString()}
                  </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRoom(room.room)}
                                    >
                                        <Trash2 className="text-red-600 hover:text-red-800" size={18} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Price Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm mb-1">Room Type Price</label>
                        <input
                            value={`₦${currentPrice.toLocaleString()}`}
                            disabled
                            className="bg-gray-100 px-4 py-2 w-full rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Total Price</label>
                        <input
                            value={`₦${totalPrice.toLocaleString()}`}
                            disabled
                            className="bg-gray-100 px-4 py-2 w-full rounded"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        Submit
                    </button>
                </div>

            </form>
            {/* ✅ Confirm Modal */}
            {showConfirm && (
                <ConfirmModal
                    message="Are you sure you want to create this reservation?"
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
                    message="Reservation Created"
                    onCancel={() => onSuccess()}
                />
            )}
        </div>
    );
};

export default CreateReservation;
