import React from 'react';
import {Download, Printer} from 'lucide-react';

const UpdateRestaurantOrder = ({
  order,
orderStatus,
setOrderStatus,
  statusOptions = [],
  onClose,
  onPrint,
    onDownload,
  onSubmit,
}) => {

    const isCompleted = order.status === "COMPLETED";

    const statusStyles = {
        COMPLETED: "bg-green-100 text-green-800",
        IN_PROGRESS: "bg-yellow-200 text-yellow-700",
        READY: "bg-blue-200 text-blue-700",
        CANCELED: "bg-red-200 text-red-700",
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-start">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Order Details</h2>
                    <button onClick={onClose} className="text-red-500 hover:underline">Close</button>
                </div>

                {/* Order Info */}
                <div className="mb-6 space-y-2">
                    <p><strong>Customer:</strong> {order.customerName}</p>
                    <p><strong>Status:</strong>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[order.status]}`} >
              {order.status}
            </span>
                    </p>
                    <p><strong>Date:</strong> {order.createdDateTime}</p>
                </div>

                {/* Order Items */}
                <div className="overflow-x-auto mb-4">
                    <table className="min-w-full text-sm border">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Item</th>
                            <th className="px-4 py-2 text-left">Price</th>
                            <th className="px-4 py-2 text-left">Quantity</th>
                            <th className="px-4 py-2 text-left">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.items.map((item, idx) => (
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

                {/* Status Update */}
                {!isCompleted && (
                    <div className="mb-4">
                        <label className="block mb-1 font-medium text-sm">Update Status</label>
                        <select
                            value={orderStatus}
                            onChange={(e) => setOrderStatus(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                        onClick={onDownload}
                    >
                        <Download size={16}/> Download
                    </button>

                    <button
                        onClick={onPrint}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        <Printer size={18} />
                        Print Receipt
                    </button>

                    {!isCompleted && (
                        <button
                            onClick={onSubmit}
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                        >
                            Update
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateRestaurantOrder;
