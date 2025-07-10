import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import {useNavigate} from "react-router-dom";

const CreateDiscount = ({ onClose, onSubmit }) => {
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [isActive, setIsActive] = useState('true');
    const [oneTimeUse, setOneTimeUse] = useState('false');
    const [validFrom, setValidFrom] = useState('');
    const [validTo, setValidTo] = useState('');

    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");



    const handleSubmit = () => {
        if (!discountPercentage || !isActive || !oneTimeUse || !validFrom || !validTo) {
            setModalMessage("Required Fields cannot be null")
            setShowMissingFields(true);
        }
        else{
            setShowConfirm(true);
        }
    };

    const confirmSubmission = async () => {
        // console.log(`Creating Discount  ${discountPercentage}`);
        setShowConfirm(false);
        setLoading(true);
        try {
            const request = {
                code: null,
                percentage: discountPercentage,
                startDate: validFrom,
                endDate: validTo,
                active: isActive,
                oneTimeUse: oneTimeUse
            }
            const res = await restClient.post('/discount/', request, navigate);
            // console.log("Add Room",res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("Discount Created");
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
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center text-start text-[15px]">
            {loading && <LoadingScreen />}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create Discount</h2>
                    <button onClick={onClose} className="text-red-500 text-sm hover:underline">Close</button>
                </div>

                <div className="space-y-4">
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
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Submit
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

export default CreateDiscount;
