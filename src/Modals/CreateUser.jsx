import React, { useState } from 'react';
import ConfirmModal from "../components/ConfirmModal.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import restClient from "../utils/restClient.js";
import {useNavigate} from "react-router-dom";

const CreateUser = ({ onClose , userRoleOptions, userAccessOptions, onSubmit}) => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        role: '',
        access: '',
        isActive: 'true',
    });

    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.username || !formData.role || !formData.access || !formData.email || !formData.isActive) {
            setModalMessage("Required Fields cannot be null")
            setShowMissingFields(true);
        }
        else{
            setShowConfirm(true);
        }
    };

    const confirmSubmission = async () => {
        // console.log(`Creating User  ${formData.username}`);
        setShowConfirm(false);
        setLoading(true);
        try {
            const request = {
                email: formData.email,
                username: formData.username,
                password: null,
                role: formData.role,
                enabled: formData.isActive,
                department: formData.access,
                createdBy: null,
                lastModifiedBy: null,
                createdDateTime: null,
                lastModifiedDateTime: null
            }
            const res = await restClient.post('/admin/create', request, navigate);
            console.log("Create User",res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("User Created");
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center text-start text-[15px]">
            {loading && <LoadingScreen />}
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

export default CreateUser;
