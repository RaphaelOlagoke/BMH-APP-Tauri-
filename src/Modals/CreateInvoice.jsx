import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";
import {useNavigate} from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen.jsx";
import restClient from "../utils/restClient.js";

const CreateInvoice = ({ onClose, onSubmit, paymentMethodOptions, serviceOptions, paymentStatusOptions }) => {
    const [description, setDescription] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');

    const [itemName, setItemName] = useState('');
    const [itemQty, setItemQty] = useState(1);
    const [itemPrice, setItemPrice] = useState('');
    const [items, setItems] = useState([]);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");


    const handleAddItem = () => {
        if (!itemName || !itemQty || !itemPrice) return;

        setItems([...items, { name: itemName, quantity: itemQty, price: itemPrice }]);
        setItemName('');
        setItemQty(1);
        setItemPrice('');
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!description || !serviceType || !paymentMethod || !paymentStatus) {
            setModalMessage("Required Fields cannot be null")
            setShowMissingFields(true);
        }
        else{
            setShowConfirm(true);
        }
    };

    const confirmSubmission = async () => {
        // console.log(`Creating Invoice  ${description}`);
        setShowConfirm(false);
        setLoading(true);
        try {
            const request = {
                roomNumber: 0,
                paymentStatus: paymentStatus,
                paymentMethod: paymentMethod,
                service: serviceType,
                serviceDetails: description,
                items: items
            }
            const res = await restClient.post('/invoice/', request, navigate);
            // console.log("Add Room",res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("Invoice Created");
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Create Invoice</h2>
                    <button onClick={onClose} className="text-red-500 text-sm hover:underline">Close</button>
                </div>

                {/* Service Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Service Description"
                        className="border px-3 py-2 rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <select
                        className="border px-3 py-2 rounded"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                    >
                        <option value="">Select Service Type</option>
                        {serviceOptions.map((service) => (
                        <option key={service} value={service}>
                             {service}
                        </option>
                        ))}
                    </select>

                    <select
                        className="border px-3 py-2 rounded"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="">Select Payment Method</option>
                        {paymentMethodOptions.map((method) => (
                            <option key={method} value={method}>
                                {method}
                            </option>
                        ))}
                    </select>

                    <select
                        className="border px-3 py-2 rounded"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                        <option value="">Select Payment Status</option>
                        {paymentStatusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Invoice Items Section */}
                <div className="mb-6">
                    <h3 className="text-md font-semibold mb-2">Invoice Items</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <input
                            type="text"
                            placeholder="Item Name"
                            className="border px-3 py-2 rounded"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            min={1}
                            placeholder="Quantity"
                            className="border px-3 py-2 rounded"
                            value={itemQty}
                            onChange={(e) => setItemQty(Number(e.target.value))}
                            required
                        />
                        <input
                            type="number"
                            min={0}
                            placeholder="Price"
                            className="border px-3 py-2 rounded"
                            value={itemPrice}
                            onChange={(e) => setItemPrice(Number(e.target.value))}
                            required
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add Item
                    </button>

                    {items.length > 0 && (
                        <table className="w-full mt-4 text-sm border">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Item</th>
                                <th className="px-4 py-2">Quantity</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Remove</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{item.name}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    <td className="px-4 py-2">₦{item.price}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleRemoveItem(index)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        Submit Invoice
                    </button>
                </div>
            </div>
            {showConfirm && (
                <ConfirmModal
                    message="Create invoice?"
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

export default CreateInvoice;
