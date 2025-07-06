import React from 'react';

const ChargeToRoom = ({
   rooms = [],
   selectedRoom,
   setSelectedRoom,
   guestInfo,
   billItems = [],
   subtotal = 0,
   discount = 0,
   total = 0,
   onSubmit,
   onClose,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Charge to Room</h2>
                    <button onClick={onClose} className="text-red-500 hover:underline">Close</button>
                </div>

                {/* Room Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium">Select Room</label>
                    <select
                        className="w-full border px-3 py-2 rounded"
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                    >
                        <option value="">-- Select a Room --</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.number} - {room.type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Guest Info */}
                {selectedRoom && guestInfo && (
                    <div className="bg-gray-50 p-4 rounded mb-4 text-start">
                        <p><strong>Guest Name:</strong> {guestInfo.name}</p>
                        <p><strong>Rooms:</strong> {guestInfo.rooms.join(', ')}</p>
                    </div>
                )}

                {/* Bill Table */}
                <div className="overflow-x-auto mb-4 text-start">
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

                {/* Summary */}
                <div className="space-y-1 text-right mb-4">
                    <p><strong>Subtotal:</strong> ₦{subtotal.toLocaleString()}</p>
                    <p><strong>Discount:</strong> ₦{discount.toLocaleString()}</p>
                    <p className="text-lg font-semibold"><strong>Total:</strong> ₦{total.toLocaleString()}</p>
                </div>

                <div className="flex justify-end">
                    <button
                        disabled={!selectedRoom}
                        onClick={onSubmit}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        Charge to Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChargeToRoom;
