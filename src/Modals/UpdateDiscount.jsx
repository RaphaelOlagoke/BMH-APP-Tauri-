import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";

const UpdateDiscount = ({ discount,onClose }) => {
    const [discountPercentage, setDiscountPercentage] = useState(discount.percentage || '');
    const [isActive, setIsActive] = useState(discount.active ? 'true' : 'false');
    const [oneTimeUse, setOneTimeUse] = useState(discount.oneTimeUse ? 'true' : 'false');
    const [validFrom, setValidFrom] = useState(discount.startDate || '');
    const [validTo, setValidTo] = useState(discount.endDate || '');

    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);

    const onUpdate = () => {

    }

    const handleUpdate = () => {
        if (!discountPercentage || !isActive || !oneTimeUse || !validFrom || !validTo) {
            setShowMissingFields(true);
        }
        else{
            setShowConfirm(true);
        }
    };

    const confirmSubmission = () => {
        console.log(`Updating Discount  ${discountPercentage}`);
        const payload = {
            ...discount,
            discountPercentage: parseFloat(discountPercentage),
            isActive: isActive === 'true',
            oneTimeUse: oneTimeUse === 'true',
            validFrom,
            validTo,
        };
        onUpdate(payload);
        setShowConfirm(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center text-start text-[15px]">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Update Discount</h2>
                    <button onClick={onClose} className="text-red-500 text-sm hover:underline">Close</button>
                </div>

                <div className="space-y-4">
                    <input
                        type="text"
                        value={discount.code}
                        disabled
                        className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-600"
                        placeholder="Discount Code"
                    />

                    <input
                        type="number"
                        placeholder="Discount Percentage (%)"
                        className="w-full px-4 py-2 border rounded"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(e.target.value)}
                    />

                    <select
                        className="w-full px-4 py-2 border rounded"
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value)}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>

                    <select
                        className="w-full px-4 py-2 border rounded"
                        value={oneTimeUse}
                        onChange={(e) => setOneTimeUse(e.target.value)}
                    >
                        <option value="false">Multiple Use</option>
                        <option value="true">One Time Use</option>
                    </select>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-600">Valid From</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-2 border rounded"
                                value={validFrom}
                                onChange={(e) => setValidFrom(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Valid To</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-2 border rounded"
                                value={validTo}
                                onChange={(e) => setValidTo(e.target.value)}
                            />
                        </div>
                    </div>

                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleUpdate}
                        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Update
                    </button>
                </div>
            </div>

            {showConfirm && (
                <ConfirmModal
                    message="Create Discount?"
                    onConfirm={confirmSubmission}
                    onCancel={() => setShowConfirm(false)}
                />
            )}


            {/* ✅ Missing Fields Modal */}
            {showMissingFields && (
                <ConfirmModal
                    message="Required Fields cannot be null"
                    onCancel={() => setShowMissingFields(false)}
                />
            )}
        </div>
    );
};

export default UpdateDiscount;
