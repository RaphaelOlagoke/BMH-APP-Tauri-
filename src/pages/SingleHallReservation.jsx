import React, {useState} from 'react';
import {CheckCircle, CheckCircle2, MoreVertical, PlusCircle, Printer, Repeat, Replace, Trash2} from 'lucide-react';
import {useLocation, useParams} from "react-router-dom";
import InvoiceModal from "../components/InvoiceModal.jsx";
import BackButton from "../components/BackButton.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";


const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
};

const onPrint= () =>{

}

const SingleHallReservation = () => {

    const { state } = useLocation();
    const { id } = useParams();

    const [showConfirm, setShowConfirm] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalAction, setModalAction] = useState("");
    const [showInvoice, setShowInvoice] = useState(false);

    const onMarkActive = () =>{
        setModalAction("Active");
        setModalMessage("Are you sure you want to mark active?");
        setShowConfirm(true);
    }
    const onMarkComplete= () =>{
        setModalAction("Complete");
        setModalMessage("Are you sure you want to mark complete?");
        setShowConfirm(true);
    }
    const onCancel= () =>{
        setModalAction("Cancel");
        setModalMessage("Are you sure you want to cancel?");
        setShowConfirm(true);
    }

    const confirmSubmission = () => {
        console.log(`Doing ${modalAction}`);
        setShowConfirm(false);
    };

    console.log(id);

    const reservation = state.hall;
    // const {
    //     status,
    //     guest,
    //     hallDetails
    // } = reservation;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <BackButton/>
            <div className="p-8 max-w-4xl mx-auto bg-white rounded shadow-lg text-xl text-start">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
            <span
                className={`px-4 py-1 text-sm font-semibold rounded-full capitalize ${statusColors[reservation.status.toLocaleLowerCase()] || 'bg-gray-200 text-gray-800'}`}
            >
              {reservation.status}
            </span>

                    { reservation.status.toLocaleLowerCase() !== "complete" && (
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Actions <MoreVertical size={16} />
                            </button>
                            <div className="absolute hidden group-hover:block bg-white border rounded shadow-md w-40 z-10">
                                <button onClick={onMarkActive} className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"><CheckCircle size={16} /> Mark as Active</button>
                                <button onClick={onMarkComplete} className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"><CheckCircle size={16} /> Mark as Complete</button>
                                <button onClick={onCancel} className="w-full px-4 py-2 hover:bg-red-100 flex items-center gap-2 text-sm"><Trash2 size={16} /> Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Guest Details */}
                <div className="mb-8">
                    <h2 className="font-semibold mb-3 border-b pb-1">Guest Details</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><strong>Guest Name:</strong> {reservation.guestName}</p>
                        <p><strong>Phone Number:</strong> {reservation.phoneNumber}</p>
                        <p><strong>Next of Kin:</strong> {reservation.nextOfKinName}</p>
                        <p><strong>Next of Kin Phone:</strong> {reservation.nextOfKinNumber}</p>
                        <p><strong>ID Type:</strong> {reservation.idType}</p>
                        <p><strong>ID Ref:</strong> {reservation.idRef}</p>
                    </div>
                </div>

                {/* Hall Details */}
                <div className="mb-8">
                    <h2 className=" font-semibold mb-3 border-b pb-1">Hall Details</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><strong>Hall Type:</strong> {reservation.hallType}</p>
                        <p><strong>Start Date:</strong> {reservation.startDate}</p>
                        <p><strong>End Date:</strong> {reservation.endDate}</p>
                        <p><strong>Payment Status:</strong> {reservation.paymentStatus}</p>
                        <p><strong>Amount Paid:</strong> ₦{reservation.amountPaid.toLocaleString()}</p>
                        <p className="col-span-2"><strong>Event Description:</strong> {reservation.description}</p>
                    </div>
                </div>

                {showInvoice && (
                    <InvoiceModal
                        invoices={reservation.invoices}
                        onClose={() => setShowInvoice(false)}
                    />
                )}

                {/* Print Button */}
                <div className="flex justify-between">
                    <div>
                        {reservation && reservation.invoices.length > 0 && (
                            <div className="">
                                <button
                                    onClick={() => setShowInvoice(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    View Invoices
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onPrint}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Printer size={16} />
                        Print Receipt
                    </button>
                </div>
            </div>
            {showConfirm && (
                <ConfirmModal
                    message={modalMessage}
                    onConfirm={confirmSubmission}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    );
};

export default SingleHallReservation;
