import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";

const UpdateRoom = ({ roomTypes, onClose, currentType }) => {
    const [selectedType, setSelectedType] = useState(currentType || '');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedType) {
            setShowConfirm(true);
        }
        else{
            setShowMissingFields(false);
        }
    };

    const confirmSubmission = () => {
        console.log(`Updating Room from ${currentType} to ${selectedType}`);
        setShowConfirm(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Update Room Type</h2>
                    <button onClick={onClose} className="text-red-500 hover:underline text-sm">Close</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Room Type</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        >
                            <option value="">Select Room Type</option>
                            {roomTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
            {/* ✅ Confirm Modal */}
            {showConfirm && (
                <ConfirmModal
                    message="Are you sure you want to update this room?"
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

export default UpdateRoom;
