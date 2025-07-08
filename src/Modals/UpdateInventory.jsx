import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import {useNavigate} from "react-router-dom";

const UpdateInventory = ({
    inventory,
    onClose,
    onSubmit,
    categories = [],
    reasons = []
}) => {
    const [name, setName] = useState(inventory.name || '');
    const [quantity, setQuantity] = useState(inventory.quantity || '');
    const [unit, setUnit] = useState(inventory.unit || '');
    const [category, setCategory] = useState(inventory.category || '');
    const [reason, setReason] = useState(inventory.reason || '');
    const [expirationDate, setExpirationDate] = useState(inventory.expiryDate || '');

    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");


    // const onSubmit = () => {
    //
    // }

    const handleSubmit = () => {
        if (!name || !quantity || !unit || !category || !reason) {
            setModalMessage("Required fields cannot be empty")
            setShowMissingFields(true);
        }
        else{
            setShowConfirm(true);
        }
    };

    const confirmSubmission = async () => {
        // console.log(`Updating Inventory  ${name}`);
        setShowConfirm(false);
        setLoading(true);
        try {
            const request = {
                ref : inventory.ref,
                category : category,
                name : name,
               quantity : quantity,
                unit : unit,
                reason : reason,
                expiryDate :expirationDate || null

            }
            const res = await restClient.post('/inventory/stockItem/update', request, navigate);
            // console.log("Add Room",res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("Item Updated");
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-start">
            {loading && <LoadingScreen />}
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Update Inventory</h2>
                    <button onClick={onClose} className="text-red-500 hover:underline text-sm">Close</button>
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

                    <div className="grid grid-cols-2 gap-4">
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
                            <label className="block text-sm mb-1">Reason</label>
                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                                <option value="">Select reason</option>
                                {reasons.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>
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
                message="Are you sure you want to update this inventory item?"
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

            {showSuccessModal && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => onSuccess()}
                />
            )}
        </div>
    );
};

export default UpdateInventory;
