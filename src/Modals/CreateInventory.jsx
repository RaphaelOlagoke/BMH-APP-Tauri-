import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";

const CreateInventory = ({ onClose, categories = [] }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [category, setCategory] = useState('');
    const [expirationDate, setExpirationDate] = useState('');

    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);

    const onSubmit = () => {

    }

    const handleSubmit = () => {
        if (!name || !quantity || !unit || !category) {
            setShowMissingFields(true);
        }
        else{
            setShowConfirm(true);
        }


    };

    const confirmSubmission = () => {
        console.log(`Creating Inventory  ${name}`);
        onSubmit({
            name,
            quantity: parseFloat(quantity),
            unit,
            category,
            expirationDate
        });
        setShowConfirm(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-start text-[15px]">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Create Inventory</h2>
                    <button onClick={onClose} className="text-red-500 text-sm hover:underline">Close</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full border px-3 py-2 rounded"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Item name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Quantity</label>
                            <input
                                type="number"
                                className="w-full border px-3 py-2 rounded"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Quantity"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Unit</label>
                            <input
                                type="text"
                                className="w-full border px-3 py-2 rounded"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                placeholder="e.g. kg, pcs"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Category</label>
                        <select
                            className="w-full border px-3 py-2 rounded"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Expiration Date</label>
                        <input
                            type="date"
                            className="w-full border px-3 py-2 rounded"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                        />
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
                    message="Are you sure you want to create this inventory item?"
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

export default CreateInventory;
