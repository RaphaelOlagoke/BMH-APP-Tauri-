import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";

const CreateRoomService = ({ onClose }) => {
    const [serviceName, setServiceName] = useState('');
    const [price, setPrice] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);

    const onCreate = () =>{

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (serviceName && price) {
            setShowConfirm(true);
        }
        else{
            setShowMissingFields(false);
        }
    };

    const confirmSubmission = () => {
        console.log(`Creating Room Service from ${serviceName}`);
        onCreate({ serviceName, price: parseFloat(price) });
        setServiceName('');
        setPrice('');
        setShowConfirm(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-[15px]">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Create Room Service</h2>
                    <button onClick={onClose} className="text-red-500 hover:underline text-sm">Close</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Service Name</label>
                        <input
                            type="text"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            placeholder="e.g. Breakfast"
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Price (₦)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. 2500"
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
            {/* ✅ Confirm Modal */}
            {showConfirm && (
                <ConfirmModal
                    message="Are you sure you want to create this room service?"
                    onConfirm={confirmSubmission}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {/* ✅ Missing Fields Modal */}
            {showMissingFields && (
                <ConfirmModal
                    message="Required fields cannot be empty"
                    onCancel={() => setShowMissingFields(false)}
                />
            )}
        </div>
    );
};

export default CreateRoomService;
