import React, {useState} from 'react';
import {CheckCircle} from "lucide-react";
import ConfirmModal from "./ConfirmModal.jsx";


const InvoiceModal = ({ invoices, onClose }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');

    const handleConfirmPaid = () => {
        // onMarkPaid(); // handle marking all invoices as paid
        setShowConfirm(false);
    };


    const totalOutstanding = invoices.reduce(
        (sum, invoice) => sum + (invoice.totalAmount - (invoice.amountPaid + invoice.discountAmount)),
        0
    );

    const paymentMethods = ["CASH", "CARD", "TRANSFER"]

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-[15px]">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl overflow-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Invoice Detail</h2>
                <button onClick={onClose} className="text-red-500">Close</button>
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col items-start">
                    <label className="block mb-2">Payment Method</label>
                    <select
                        className="input border mb-5"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="">-- Select Room --</option>
                        {paymentMethods.map((item) => (
                            <option key={item} value={item}>
                                 {item}
                            </option>
                        ))}
                    </select>
                </div>

                {totalOutstanding === 0 ? (
                    <span className="px-3 py-3 h-max rounded-2xl bg-green-100 text-green-800 text-sm">
                            All Paid
                        </span>
                ) : (
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
                    >
                        <CheckCircle size={18} />
                        Mark All as Paid
                    </button>
                )}
            </div>

            {/* Confirm Mark as Paid Modal */}
            {showConfirm && (
                paymentMethod !== "" ? (
                <ConfirmModal
                    message="Are you sure you want to mark all invoices as paid?"
                    onConfirm={handleConfirmPaid}
                    onCancel={() => setShowConfirm(false)}
                />
                ):
                <ConfirmModal
                        message="No Payment Method Selected"
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {invoices.map((invoice) => (
                <div className="text-start" key={invoice.ref}>
                    <p><strong>Service Type:</strong> {invoice.service}</p>
                    <p><strong>Service Description:</strong> {invoice.serviceDetails}</p>
                    <div className="flex items-center gap-4 py-2">
                        <p className="text-sm">
                            <strong>Status:</strong>
                        </p>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full
                                ${invoice.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {invoice.paymentStatus}
                            </span>
                    </div>
                    <p><strong>Issue Date:</strong> {invoice.issueDate}</p>
                    <p><strong>Payment Date:</strong> {invoice.paymentDate}</p>

                    {invoice.items.length > 0 ? (
                        <table className="min-w-full mt-4 text-sm text-left border">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Item</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Quantity</th>
                            </tr>
                            </thead>
                            <tbody>
                            {invoice.items.map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-4 py-2">{item.name}</td>
                                    <td className="px-4 py-2">₦{item.price}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="mt-4 text-gray-500">No items listed.</p>
                    )}

                    <div className="mt-4">
                        {invoice.discountCode && (<p><strong>Discount:</strong> ₦{invoice.discount}</p>)}
                        {invoice.discountCode && (<p><strong>Discount Code:</strong> {invoice.discountCode}</p>)}
                        {invoice.discountCode && (<p><strong>Discount Percentage:</strong> {invoice.discountPercentage}%</p>)}
                        <p className="py-2"><strong>Subtotal:</strong> ₦{invoice.totalAmount}</p>
                        <p><strong>Amount Paid:</strong> ₦{invoice.amountPaid}</p>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Download</button>
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Print</button>
                    </div>

                    <hr className="my-6 border-6 border-black" />
                </div>
            ))}

        </div>
    </div>
)};

export default InvoiceModal;