import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import {useNavigate} from "react-router-dom";

const CreateRoomService = ({ onClose, onSubmit }) => {
    const [serviceName, setServiceName] = useState('');
    const [price, setPrice] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");

    // const onCreate = () =>{
    //
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (serviceName && price) {
            setShowConfirm(true);
        }
        else{
            setModalMessage("Required fields cannot be empty")
            setShowMissingFields(false);
        }
    };

    const confirmSubmission = async () => {
        // console.log(`Creating Room Service from ${serviceName}`);
        setShowConfirm(false);
        setLoading(true);
        try {
            const request = {
                ref: null,
               service: serviceName,
                price: price
            }
            const res = await restClient.post('/room/service/', request, navigate);
            // console.log("Add Room",res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("Room service created");
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-[15px]">
            {loading && <LoadingScreen />}
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

export default CreateRoomService;
