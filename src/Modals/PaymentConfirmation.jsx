import React from 'react';

const PaymentConfirmation = ({ billItems = [], subtotal = 0, discount = 0, total = 0, customerName, setCustomerName, onSubmit, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center text-start">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Confirm Payment</h2>
                    <button onClick={onClose} className="text-red-500 hover:underline">Close</button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Customer Name</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer's name"
                    />
                </div>

                <div className="overflow-x-auto mb-4">
                    <table className="min-w-full text-sm border">
                        <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-4 py-2 text-left">Item</th>
                            <th className="px-4 py-2 text-left">Price</th>
                            <th className="px-4 py-2 text-left">Qty</th>
                            <th className="px-4 py-2 text-left">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {billItems.map((item, idx) => (
                            <tr key={idx} className="border-t">
                                <td className="px-4 py-2">{item.name}</td>
                                <td className="px-4 py-2">₦{item.price}</td>
                                <td className="px-4 py-2">{item.quantity}</td>
                                <td className="px-4 py-2">₦{(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-1 text-right mb-4">
                    <p><strong>Subtotal:</strong> ₦{subtotal.toLocaleString()}</p>
                    <p className="my-3"><strong>Discount:</strong> ₦{discount.toLocaleString()}</p>
                    <p className="text-lg font-semibold"><strong>Total:</strong> ₦{total.toLocaleString()}</p>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onSubmit}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentConfirmation;
