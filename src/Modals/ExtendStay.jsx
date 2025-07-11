import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import {useNavigate} from "react-router-dom";
import restClient from "../utils/restClient.js";

const ExtendStay = ({ onClose, onSubmit, guest }) => {
    const [extraDays, setExtraDays] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (extraDays && Number(extraDays) > 0) {
            setShowConfirm(true);
        }
        else{
            setModalMessage("Field cannot be null")
            setShowMissingFields(false);
        }
    };

    const confirmSubmission = async () => {
        // console.log('Extend Stay by:', { extraDays});
        setShowConfirm(false);
        setLoading(true);
        try {
            const currentRoom = guest.guestLogRooms.find(
                (logRoom) => logRoom.guestLogStatus === "ACTIVE"
            )?.room.roomNumber;
            const res = await restClient.post(`/guestLog/extend?roomNumber=${currentRoom}&noOfDays=${extraDays}`, {}, navigate);
            // console.log("Add Room",res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("Successful");
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            {loading && <LoadingScreen />}
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
                    message={modalMessage}
                    onCancel={() => setShowMissingFields(false)}
                />
            )}
            {/* ✅ On Successful */}
            {showSuccessModal && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => onSuccess()}
                />
            )}
        </div>
    );
};

export default ExtendStay;
