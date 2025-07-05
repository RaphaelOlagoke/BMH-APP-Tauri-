import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";

const CreateRoom = ({ roomTypes = [], onClose }) => {
    const [roomNumber, setRoomNumber] = useState('');
    const [roomType, setRoomType] = useState('');

    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (roomNumber && roomType) {
            setShowConfirm(true);
        }
        else{
            setShowMissingFields(false);
        }
    };

    const confirmSubmission = () => {
        console.log('Creating Room:', { roomNumber});
        setShowConfirm(false);
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center text-[15px]">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Create Room</h2>
                    <button onClick={onClose} className="text-red-500 hover:underline">Close</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Room Number</label>
                        <input
                            type="text"
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter room number"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Room Type</label>
                        <select
                            value={roomType}
                            onChange={(e) => setRoomType(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select room type</option>
                            {roomTypes.map((type, idx) => (
                                <option key={idx} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Submit
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
                    message="No room selected"
                    onCancel={() => setShowMissingFields(false)}
                />
            )}
        </div>
    );
};

export default CreateRoom;
