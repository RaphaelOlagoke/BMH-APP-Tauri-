import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import restClient from "../utils/restClient.js";
import {useNavigate} from "react-router-dom";

const CreateHousekeeping = ({ rooms = [], onSubmit,  onClose }) => {
    const [selectedRoom, setSelectedRoom] = useState('');

    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");


    const handleSubmit = () => {
        if (!selectedRoom) {
            setModalMessage("No room selected")
            setShowMissingFields(true);
        }
        else{
            setShowConfirm(true);
        }

    };

    const confirmSubmission = async () => {
        // console.log(`Creating HouseKeeping  ${selectedRoom}`);
        setShowConfirm(false);
        setLoading(true);
        try {
            const request = {
                roomNumber: selectedRoom

            }
            const res = await restClient.post('/cleaningLog/', request, navigate);
            // console.log("Add Room",res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("Item Created");
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center text-start text-[15px]">
            {loading && <LoadingScreen />}
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

export default CreateHousekeeping;
