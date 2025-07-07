import React, {useEffect, useState} from 'react';
import { X, Trash2 } from 'lucide-react';
import restClient from "../utils/restClient.js";
import {useNavigate} from "react-router-dom";
import LoadingScreen from "./LoadingScreen.jsx";
import ConfirmModal from "./ConfirmModal.jsx";

// const services = [
//     { name: 'Laundry', price: 3000 },
//     { name: 'Breakfast', price: 2500 },
//     { name: 'Drinks', price: 2000 },
// ];

const RoomServiceModal = ({ onClose, onCharge, guest }) => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [addedServices, setAddedServices] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            try {
                const res = await restClient.get('/room/service/filter?query=', navigate);
                console.log("Room Service",res)
                if(res.responseHeader.responseCode === "00") {
                    setServices(res.data);
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
        }
        fetchRooms();
    }, []);

    const handleAddService = () => {
        const service = services.find((s) => s.service === selectedService);
        if (service && !addedServices.some(s => s.service === service.service)) {
            setAddedServices([...addedServices, service]);
        }
    };

    const handleRemove = (name) => {
        setAddedServices(addedServices.filter((s) => s.service !== name));
    };

    const handleCharge = () => {
        if (addedServices.length > 0) {
            setModalMessage("Charge Service to Room?")
            setShowConfirm(true);
        }
        else{
            setModalMessage("No service selected");
            setShowMissingFields(false);
        }
    };

    const confirmSubmission = async () => {
        // console.log('Adding Room:', { roomNumber});
        setShowConfirm(false);
        setLoading(true);
        try {
            const currentRoom = guest.guestLogRooms[0].room.roomNumber;
            const items = addedServices.map(service => ({
                name: service.service,
                quantity: 1,
                price: service.price
            }));
            const request = {
                roomNumber: currentRoom,
                paymentStatus: "UNPAID",
                paymentMethod: "NONE",
                service:"ROOM",
                serviceDetails:"Room Service",
                items: items
            }
            const res = await restClient.post('/invoice/', request, navigate);
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
        onCharge();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            {loading && <LoadingScreen />}
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Room Service</h2>
                    <button onClick={onClose}><X size={20} className="text-red-600" /></button>
                </div>

                {/* Service Dropdown */}
                <div className="flex items-center space-x-4 mb-6">
                    <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="flex-1 p-2 border rounded"
                    >
                        <option value="">Select Service</option>
                        {services.map((service) => (
                            <option key={service.service} value={service.service}>
                                {service.service} - ₦{service.price}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddService}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Add
                    </button>
                </div>

                {/* Table of Added Services */}
                <table className="w-full text-sm border">
                    <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-center">Remove</th>
                    </tr>
                    </thead>
                    <tbody>
                    {addedServices.map((service, idx) => (
                        <tr key={idx} className="border-t">
                            <td className="px-4 py-2">{service.service}</td>
                            <td className="px-4 py-2">₦{service.price.toLocaleString()}</td>
                            <td className="px-4 py-2 text-center">
                                <button onClick={() => handleRemove(service.service)}>
                                    <Trash2 size={18} className="text-red-600 hover:text-red-800" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {addedServices.length === 0 && (
                        <tr>
                            <td colSpan="3" className="text-center text-gray-400 py-4">No service added</td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* Charge Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleCharge}
                        disabled={addedServices.length === 0}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        Charge
                    </button>
                </div>
            </div>

            {showMissingFields && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => setShowMissingFields(false)}
                />
            )}

            {showConfirm && (
                <ConfirmModal
                    message={modalMessage}
                    onConfirm={confirmSubmission}
                    onCancel={() => setShowConfirm(false)}
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

export default RoomServiceModal;
