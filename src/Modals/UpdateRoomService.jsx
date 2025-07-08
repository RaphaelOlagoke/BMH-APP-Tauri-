import React, { useState } from 'react';
import { Trash2, Save } from 'lucide-react';
import ConfirmModal from "../components/ConfirmModal.jsx";
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import {useNavigate} from "react-router-dom";

const UpdateRoomService = ({ service, onClose, onSubmit }) => {
    const [serviceName, setServiceName] = useState(service.service || '');
    const [price, setPrice] = useState(service.price || '');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");
    // const onUpdate = () => {
    //
    // };
    // const onDelete = () => {
    //
    // };
    const handleUpdate = () => {
        if (serviceName && price) {
            setShowConfirm(true);
        }
        else{
            setModalMessage("Required fields cannot be empty")
            setShowMissingFields(true);
        }
    };

    const confirmSubmission = async () => {
        // console.log(`Updating Room Service  ${serviceName}`);
        setShowConfirm(false);
        setLoading(true);
        try {
            const request = {
                ref: service.ref,
                service: serviceName,
                price: price
            }
            const res = await restClient.post('/room/service/update', request, navigate);
            // console.log("Add Room",res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("Room service Updated");
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

    const handleDelete = () => {
        setShowConfirmDelete(true);
    };

    const confirmDelete = async () => {
        // console.log(`Deleting Room Service ${serviceName}`);
        setShowConfirmDelete(false);
        setLoading(true);
        try {
            const request = {
                ref: service.ref,
                service: serviceName,
                price: price
            }
            const res = await restClient.post('/room/service/delete', request, navigate);
            // console.log("Add Room",res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("Room service Deleted");
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {loading && <LoadingScreen />}
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Update Room Service</h2>
                    <button onClick={onClose} className="text-red-500 hover:underline text-sm">Close</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Service Name</label>
                        <input
                            type="text"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Service name"
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
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Price"
                        />
                    </div>

                    <div className="flex justify-between pt-4">
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                            <Trash2 size={18} />
                            Delete
                        </button>

                        <button
                            onClick={handleUpdate}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            <Save size={18} />
                            Update
                        </button>
                    </div>
                </div>
            </div>

            {showConfirm && (
                <ConfirmModal
                    message="Are you sure you want to update this room service?"
                    onConfirm={confirmSubmission}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {showConfirmDelete && (
                <ConfirmModal
                    message={`Are you sure you want to delete this room service (${serviceName})?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirmDelete(false)}
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

export default UpdateRoomService;
