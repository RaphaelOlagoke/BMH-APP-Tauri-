import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";

const CreateHousekeeping = ({ rooms = [],  onClose }) => {
    const [selectedRoom, setSelectedRoom] = useState('');

    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);

    const onSubmit = () => {

    }

    const handleSubmit = () => {
        if (!selectedRoom) {
            setShowMissingFields(true);
        }
        else{
            setShowConfirm(true);
        }

    };

    const confirmSubmission = () => {
        console.log(`Creating HouseKeeping  ${selectedRoom}`);
        onSubmit(selectedRoom);
        setShowConfirm(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center text-start text-[15px]">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Create Housekeeping Task</h2>
                    <button onClick={onClose} className="text-red-500 text-sm hover:underline">Close</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Room</label>
                        <select
                            className="w-full border px-3 py-2 rounded"
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                        >
                            <option value="">Select a room</option>
                            {rooms.map((room) => (
                                <option key={room} value={room}>
                                    Room {room}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>

            {showConfirm && (
            <ConfirmModal
                message="Confirm Action?"
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

export default CreateHousekeeping;
