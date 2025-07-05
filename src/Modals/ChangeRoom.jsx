import React, { useState, useEffect } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";

const ChangeRoom = ({
     currentRooms = [],         // e.g. ['101', '102']
     roomTypes = [],            // e.g. [{ type: 'Standard', price: 15000 }, ...]
     availableRooms = {},       // e.g. { Standard: ['103', '104'], Deluxe: ['201'] }
     onClose
 }) => {
    const [currentRoom, setCurrentRoom] = useState('');
    const [newRoomType, setNewRoomType] = useState('');
    const [newRoom, setNewRoom] = useState('');
    const [newPrice, setNewPrice] = useState(0);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);

    useEffect(() => {
        if (newRoomType) {
            const selected = roomTypes.find((r) => r.type === newRoomType);
            setNewPrice(selected ? selected.price : 0);
            setNewRoom('');
        }
    }, [newRoomType]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentRoom && newRoomType && newRoom) {
            setShowConfirm(true);
        }
        else{
            setShowMissingFields(false);
        }
    };

    const confirmSubmission = () => {
        console.log(`Changing Room:, ${ currentRoom} to ${ newRoom }`);
        setShowConfirm(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Change Room</h2>
                    <button onClick={onClose} className="text-red-500 hover:underline">
                        Close
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Room */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Current Room</label>
                        <select
                            value={currentRoom}
                            onChange={(e) => setCurrentRoom(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none"
                            required
                        >
                            <option value="">Select Current Room</option>
                            {currentRooms.map((room) => (
                                <option key={room} value={room}>
                                    {room}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* New Room Type */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">New Room Type</label>
                        <select
                            value={newRoomType}
                            onChange={(e) => setNewRoomType(e.target.value)}
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

                    {/* New Room */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">New Room</label>
                        <select
                            value={newRoom}
                            onChange={(e) => setNewRoom(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none"
                            required
                            disabled={!newRoomType}
                        >
                            <option value="">Select New Room</option>
                            {(availableRooms[newRoomType] || []).map((room) => (
                                <option key={room} value={room}>
                                    {room}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price Display */}
                    <div>
                        <p className="text-sm">
                            <strong>New Room Price:</strong>{' '}
                            <span className="text-blue-600">₦{newPrice.toLocaleString()}</span>
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Change Room
                    </button>
                </form>
            </div>
            {/* ✅ Confirm Modal */}
            {showConfirm && (
                <ConfirmModal
                    message={`Are you sure you want to change room ${currentRoom} to ${newRoom}?`}
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

export default ChangeRoom;
