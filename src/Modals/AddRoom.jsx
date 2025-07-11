import React, { useState, useEffect } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";
import {useNavigate} from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen.jsx";
import restClient from "../utils/restClient.js";

const AddRoom = ({
      roomTypes = [],
      availableRooms = {},
      onClose,
    guest,
    onSubmit,
  }) => {
    const [roomType, setRoomType] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [roomPrice, setRoomPrice] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        if (roomType) {
            const selectedType = roomTypes.find((r) => r.type === roomType);
            setRoomPrice(selectedType ? selectedType.price : 0);
            setRoomNumber(''); // Reset room selection when type changes
        }
    }, [roomType]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (roomType && roomNumber) {
            setShowConfirm(true);
        }
        else{
            setModalMessage("No rooms selected");
            setShowMissingFields(false);
        }
    };

    const confirmSubmission = async () => {
        // console.log('Adding Room:', { roomNumber});
        setShowConfirm(false);
        setLoading(true);
        try {
            const currentRoom = guest.guestLogRooms.find(
                (logRoom) => logRoom.guestLogStatus === "ACTIVE"
            )?.room.roomNumber;
            const res = await restClient.post(`/guestLog/addRoom?currentRoom=${currentRoom}&newRoom=${roomNumber}`, {}, navigate);
            // console.log("Add Room",res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("Room added successfully");
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            {loading && <LoadingScreen />}
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Add Room</h2>
                    <button onClick={onClose} className="text-red-500 hover:underline">
                        Close
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Room Type</label>
                        <select
                            value={roomType}
                            onChange={(e) => setRoomType(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none"
                            required
                        >
                            <option value="">Select Room Type</option>
                            {roomTypes.map((r) => (
                                <option key={r.type} value={r.type}>
                                    {r.type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Room Number</label>
                        <select
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none"
                            required
                            disabled={!roomType}
                        >
                            <option value="">Select Room</option>
                            {(availableRooms[roomType] || []).map((room) => (
                                <option key={room} value={room}>
                                    {room}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <p className="text-sm">
                            <strong>Room Price:</strong>{' '}
                            <span className="text-blue-600">₦{roomPrice.toLocaleString()}</span>
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Add Room
                    </button>
                </form>
            </div>
            {/* ✅ Confirm Modal */}
            {showConfirm && (
                <ConfirmModal
                    message="Are you sure you want to add this room?"
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
                    message={modalMessage}
                    onCancel={() => onSuccess()}
                />
            )}
        </div>
    );
};

export default AddRoom;
