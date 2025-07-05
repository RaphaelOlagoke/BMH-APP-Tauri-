import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';

const services = [
    { name: 'Laundry', price: 3000 },
    { name: 'Breakfast', price: 2500 },
    { name: 'Drinks', price: 2000 },
];

const RoomServiceModal = ({ onClose, onCharge }) => {
    const [selectedService, setSelectedService] = useState('');
    const [addedServices, setAddedServices] = useState([]);

    const handleAddService = () => {
        const service = services.find((s) => s.name === selectedService);
        if (service && !addedServices.some(s => s.name === service.name)) {
            setAddedServices([...addedServices, service]);
        }
    };

    const handleRemove = (name) => {
        setAddedServices(addedServices.filter((s) => s.name !== name));
    };

    const handleCharge = () => {
        onCharge(addedServices);
        setAddedServices([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
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
                            <option key={service.name} value={service.name}>
                                {service.name} - ₦{service.price}
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
                            <td className="px-4 py-2">{service.name}</td>
                            <td className="px-4 py-2">₦{service.price.toLocaleString()}</td>
                            <td className="px-4 py-2 text-center">
                                <button onClick={() => handleRemove(service.name)}>
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
        </div>
    );
};

export default RoomServiceModal;
