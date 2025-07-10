import React, { useState } from 'react';
import restClient from '../utils/restClient';
import ConfirmModal from "../components/ConfirmModal.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import {useNavigate} from "react-router-dom";

const CreateRefund = ({ onClose, onSubmit }) => {
    const [invoiceRef, setInvoiceRef] = useState('');
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [refundReason, setRefundReason] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();

    const statusStyles = {
        PAID: "bg-green-100 text-green-800",
        UNPAID: "bg-yellow-200 text-yellow-700",
        REFUNDED: "bg-blue-200 text-blue-700",
        DEBIT: "bg-red-200 text-red-700",
    };

    const handleFetchInvoice = async () => {
        try {
            const res = await restClient.get(`/invoice/ref?ref=${invoiceRef}`, navigate);
            if (res?.responseHeader?.responseCode === "00") {
                setInvoiceDetails(res.data);
            }
            else{
                setModalMessage("Invoice not found");
                setShowModal(true);
                setInvoiceDetails(null);
            }

            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setModalMessage("Invoice not found");
            setShowModal(true);
            setInvoiceDetails(null);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await restClient.post('/refund/', {
                invoiceRef: invoiceRef,
                reason: refundReason,
            });
            setModalMessage("Refund successful");
            setShowModal(true);
            onSubmit();
            onClose();
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setModalMessage("Failed to submit refund");
            setShowModal(true);
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center text-start text-[15px]">
            {loading && <LoadingScreen />}
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl space-y-4 relative">
                <h2 className="text-xl font-bold">Create Refund</h2>

                {/* Invoice Ref Field */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={invoiceRef}
                        onChange={(e) => setInvoiceRef(e.target.value)}
                        placeholder="Enter Invoice Ref"
                        className="input w-full"
                    />
                    <button
                        onClick={handleFetchInvoice}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Fetch
                    </button>
                </div>

                {/* Invoice Details */}
                {invoiceDetails && (
                    <div className="bg-gray-50 p-4 rounded text-sm space-y-1 border">
                        <p><strong>Ref:</strong> {invoiceDetails.ref}</p>
                        <p><strong>Issue Date:</strong> {invoiceDetails.issueDate}</p>
                        <p><strong>Payment Date:</strong> {invoiceDetails.paymentDate}</p>
                        <p><strong>Total Amount:</strong> ₦{invoiceDetails.totalAmount}</p>
                        <p>
                            <strong>Status:</strong>{' '}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[invoiceDetails.paymentStatus]}`}>
                {invoiceDetails.paymentStatus}
              </span>
                        </p>
                        <p><strong>Payment Method:</strong> {invoiceDetails.paymentMethod}</p>
                        <p><strong>Service:</strong> {invoiceDetails.service}</p>
                        <p><strong>Service Details:</strong> {invoiceDetails.serviceDetails}</p>
                        <p><strong>Discount Code:</strong> {invoiceDetails.discountCode}</p>
                        <p><strong>Discount %:</strong> {invoiceDetails.discountPercentage}</p>
                        <p><strong>Discount Amount:</strong> ₦{invoiceDetails.discountAmount}</p>
                        <p><strong>Amount Paid:</strong> ₦{invoiceDetails.amountPaid}</p>
                    </div>
                )}

                {/* Refund Reason */}
                {invoiceDetails && (
                    <textarea
                        placeholder="Refund Reason"
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        className="input w-full"
                        rows={3}
                    />
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    {invoiceDetails && invoiceDetails.paymentStatus === "PAID" && (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            disabled={!invoiceDetails || loading}
                        >
                            Submit Refund
                        </button>
                    )}
                </div>

            </div>
            {/* Confirmation Modal */}
            {showConfirm && (
                <ConfirmModal
                    title="Confirm Refund"
                    message="Are you sure you want to submit this refund?"
                    onConfirm={handleSubmit}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {showModal && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default CreateRefund;
