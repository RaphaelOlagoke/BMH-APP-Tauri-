import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";
import restClient from "../utils/restClient.js";
import {useNavigate} from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen.jsx";

const UpdateRoom = ({ room,roomTypes, onClose, selectedType,setSelectedType, onUpdate }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedType) {
            setShowConfirm(true);
        }
        else{
            setModalMessage("No room selected")
            setShowMissingFields(false);
        }
    };

    const confirmSubmission = async () => {
        setShowConfirm(false);
        setLoading(true);
        const updateRequest = {
            roomNumber: room.roomNumber,
            roomType: selectedType,
            roomStatus: null,
            needsCleaning: null,
            needsMaintenance: null,
            archived: null,
            maintenance: null,
        };
        try {
            const res = await restClient.post("/room/update", updateRequest, navigate);
            console.log(res)
            if(res.data && res.responseHeader.responseCode === "00") {
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
        onUpdate();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {loading && <LoadingScreen />}
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
                    message={modalMessage}
                    onCancel={() => setShowMissingFields(false)}
                />
            )}

            {showSuccessModal && (
                <ConfirmModal
                    message="Room Updated"
                    onCancel={() => onSuccess()}
                />
            )}
        </div>
    );
};

export default UpdateRoom;
