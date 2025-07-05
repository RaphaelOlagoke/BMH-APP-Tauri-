import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";

const ExtendStay = ({ onClose }) => {
    const [extraDays, setExtraDays] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (extraDays && Number(extraDays) > 0) {
            setShowConfirm(true);
        }
        else{
            setShowMissingFields(false);
        }
    };

    const confirmSubmission = () => {
        console.log('Extend Stay by:', { extraDays});
        setShowConfirm(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Extend Stay</h2>
                    <button onClick={onClose} className="text-red-500 hover:underline">
                        Close
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Number of Extra Days</label>
                        <input
                            type="number"
                            min="1"
                            value={extraDays}
                            onChange={(e) => setExtraDays(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter number of days"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
            {/* ✅ Confirm Modal */}
            {showConfirm && (
                <ConfirmModal
                    message={`Are you sure you want to extend stay by ${extraDays} day(s)`}
                    onConfirm={confirmSubmission}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {/* ✅ Missing Fields Modal */}
            {showMissingFields && (
                <ConfirmModal
                    message="Field cannot be null"
                    onCancel={() => setShowMissingFields(false)}
                />
            )}
        </div>
    );
};

export default ExtendStay;
