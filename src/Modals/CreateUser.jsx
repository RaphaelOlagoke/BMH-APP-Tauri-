import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";

const CreateUser = ({ onClose , userRoleOptions, userAccessOptions}) => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        role: '',
        access: '',
        isActive: 'true',
    });

    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);

    const onSubmit = () => {

    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.username || !formData.role || !formData.access || !formData.email || !formData.isActive) {
            setShowMissingFields(true);
        }
        else{
                setShowConfirm(true);
        }
    };

    const confirmSubmission = () => {
        console.log(`Creating User  ${formData.username}`);
        onSubmit(formData);
        setShowConfirm(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center text-start text-[15px]">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create New User</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full mt-1 px-4 py-2 border rounded"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="w-full mt-1 px-4 py-2 border rounded"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">User Role</label>
                        <select
                            name="role"
                            className="w-full mt-1 px-4 py-2 border rounded"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Role</option>
                            {userRoleOptions.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Access Level</label>
                        <select
                            name="access"
                            className="w-full mt-1 px-4 py-2 border rounded"
                            value={formData.access}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Access</option>
                            {userAccessOptions.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Is Active</label>
                        <select
                            name="isActive"
                            className="w-full mt-1 px-4 py-2 border rounded"
                            value={formData.isActive}
                            onChange={handleChange}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Create User
                    </button>
                </form>
            </div>

            {showConfirm && (
                <ConfirmModal
                    message="Create User?"
                    onConfirm={confirmSubmission}
                    onCancel={() => setShowConfirm(false)}
                />
            )}


            {/* ✅ Missing Fields Modal */}
            {showMissingFields && (
                <ConfirmModal
                    message="Required Fields cannot be null"
                    onCancel={() => setShowMissingFields(false)}
                />
            )}
        </div>
    );
};

export default CreateUser;
