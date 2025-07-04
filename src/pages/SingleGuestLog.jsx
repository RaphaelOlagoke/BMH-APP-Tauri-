import React, {useState} from "react";
import {MoreVertical, BedDouble, PlusCircle, Repeat, Replace, ArrowLeft} from "lucide-react";
import {useLocation, useParams} from "react-router-dom";
import InvoiceModal from "../components/InvoiceModal.jsx";
import BackButton from "../components/BackButton.jsx";

const statusStyles = {
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-200 text-gray-700",
};

const paymentStatusStyles = {
    paid: "bg-green-100 text-green-800",
    unpaid: "bg-red-100 text-red-800",
};



const SingleGuestLog = () => {
    const { state } = useLocation();
    const { id } = useParams();

    const [showInvoice, setShowInvoice] = useState(false);

    console.log(id);

    const guest = state?.guest || {};

// Dummy functions for room actions
    const onAddRoom = () => alert("Add Room for " + guest.name);
    const onChangeRoom = () => alert("Change Room for " + guest.name);
    const onExtendStay = () => alert("Extend Stay for " + guest.name);
    const onRoomServiceClick = () => alert("Room Service for " + guest.name);


    return (
        <div className="p-6 max-w-5xl mx-auto">
            <BackButton/>

            {/* Guest Info Section */}
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4 text-start">
                {/* Status Badge */}
                <div className="flex justify-end">
                    <span className={`px-4 py-1 text-sm rounded-full font-medium ${statusStyles[guest.status] || ""}`}>
                        {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                    </span>
                </div>

                <h2 className="text-xl font-semibold border-b pb-2">Guest Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <p><strong>Name:</strong> {guest.name}</p>
                    <p><strong>Phone:</strong> {guest.phone}</p>
                    <p><strong>Next of Kin:</strong> {guest.nextOfKin}</p>
                    <p><strong>Next of Kin Phone:</strong> {guest.nextOfKinPhone}</p>
                    <p><strong>Check-in Date:</strong> {guest.checkInDate}</p>
                    <p><strong>Expected Checkout:</strong> {guest.expectedCheckout}</p>
                    <p><strong>Actual Checkout:</strong> {guest.checkoutDate || "Not checked out yet"}</p>
                    <p><strong>ID Type:</strong> {guest.idType}</p>
                    <p><strong>ID Reference:</strong> {guest.idRef}</p>
                </div>
            </div>

            {/* Room & Payment Details Section */}
            <div className="bg-white p-6 my-8 rounded-xl shadow-md space-y-4 text-start">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold">Room & Payment Details</h2>
                    { guest.status === "active" && (
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Actions <MoreVertical size={16} />
                            </button>
                            <div className="absolute hidden group-hover:block bg-white border rounded shadow-md w-40 z-10">
                                <button onClick={onAddRoom} className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"><PlusCircle size={16} /> Add Room</button>
                                <button onClick={onChangeRoom} className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"><Replace size={16} /> Change Room</button>
                                <button onClick={onExtendStay} className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"><Repeat size={16} /> Extend Stay</button>
                            </div>
                        </div>
                    )}

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <p><strong>Room(s):</strong> {guest.rooms.join(", ")}</p>
                    <p>
                        <strong>Payment Status:</strong>{" "}
                        <span className={`px-2 py-1 rounded ${paymentStatusStyles[guest.paymentStatus]}`}>
                            {guest.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                    </p>
                    <p><strong>Amount Paid:</strong> ₦{guest.amountPaid?.toLocaleString()}</p>
                    <p><strong>Credit Amount:</strong> ₦{guest.creditAmount?.toLocaleString()}</p>
                    <p><strong>Amount Due:</strong> ₦{guest.outstanding?.toLocaleString()}</p>
                    <p><strong>Outstanding:</strong> ₦{guest.outstanding?.toLocaleString()}</p>
                    <p><strong>Room Types:</strong> {guest.roomTypes.join(", ")}</p>
                </div>
            </div>

            {showInvoice && (
                <InvoiceModal
                    invoices={guest.invoices}
                    onClose={() => setShowInvoice(false)}
                />
            )}

            {/* Room Service Button */}
            <div className="flex justify-between">
                <div>
                    {guest && guest.invoices.length > 0 && (
                        <div className="">
                            <button
                                onClick={() => setShowInvoice(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                View Invoices ({guest.invoices.length})
                            </button>
                        </div>
                    )}
                </div>

                { guest.status === "active" && (
                    <button
                        onClick={onRoomServiceClick}
                        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 flex items-center gap-2"
                    >
                        <BedDouble size={18} />
                        Room Service
                    </button>
                )}

            </div>
        </div>
    );
};

export default SingleGuestLog;
