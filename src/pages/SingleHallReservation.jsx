import React, {useState} from 'react';
import {CheckCircle, CheckCircle2, MoreVertical, PlusCircle, Printer, Repeat, Replace, Trash2} from 'lucide-react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import InvoiceModal from "../components/InvoiceModal.jsx";
import BackButton from "../components/BackButton.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import restClient from "../utils/restClient.js";


const statusColors = {
    PAID: 'bg-green-100 text-green-800',
    UNPAID: 'bg-red-100 text-red-800',
};

const statusStyles = {
    ACTIVE: "bg-green-100 text-green-800",
    COMPLETE: "bg-blue-200 text-blue-700",
    UPCOMING: "bg-yellow-200 text-yellow-700",
    CANCELED: "bg-red-200 text-red-700",
};

// const onPrint= () =>{
//
// }

const SingleHallReservation = () => {

    const { state } = useLocation();
    const { id } = useParams();

    const [showConfirm, setShowConfirm] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalAction, setModalAction] = useState("");
    const [showInvoice, setShowInvoice] = useState(false);
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(state.hall);

    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const onMarkActive = () =>{
        setModalAction("ACTIVE");
        setModalMessage("Are you sure you want to mark active?");
        setShowConfirm(true);
    }
    const onMarkComplete= () =>{
        setModalAction("COMPLETE");
        setModalMessage("Are you sure you want to mark complete?");
        setShowConfirm(true);
    }
    const onCancel= () =>{
        setModalAction("CANCELED");
        setModalMessage("Are you sure you want to cancel?");
        setShowConfirm(true);
    }

    const confirmSubmission = async () => {
        console.log(`Doing ${modalAction}`);
        setLoading(true);
        try {
            const res = await restClient.post("/hallLog/update", {ref: state.hall.ref, status: modalAction}, navigate);
            console.log(res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("Successful")
                setShowSuccessModal(true);
            }
            else{
                setModalMessage(res.responseHeader.responseMessage ?? "Something went wrong!");
                showModal(true);
            }
        }
            // eslint-disable-next-line no-unused-vars
        catch (error) {
            setModalMessage("Something went wrong!");
            showModal(true);
        }
        finally {
            setLoading(false);
        }
        setModalMessage("Successful")
        setShowConfirm(false);
    };

    const onSuccess = () => {
        setShowSuccessModal(false)
        state.hall.status = modalAction;
        setReservation(state.hall);
        // navigate(`/hall-reservation/${state.hall.ref}`, { state: { hall : state.hall } });
    }

    console.log(id);

    // const reservation = state.hall;
    // const {
    //     status,
    //     guest,
    //     hallDetails
    // } = reservation;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {loading && <LoadingScreen />}
            <BackButton/>
            <div className="p-8 max-w-4xl mx-auto bg-white rounded shadow-lg text-xl text-start">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
            <span
                className={`px-4 py-1 text-sm font-semibold rounded-full capitalize ${statusStyles[reservation.status] || 'bg-gray-200 text-gray-800'}`}
            >
              {reservation.status}
            </span>

                    { reservation.status !== "COMPLETE" && reservation.status !== "CANCELED" && (
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
                        <p><strong>Hall Type:</strong> {reservation.hall}</p>
                        <p>
                            <strong>Start Date:</strong>{" "}
                            {reservation.startDate
                                ? ((d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)(new Date(reservation.startDate)))
                                : "-"}
                        </p>

                        <p>
                            <strong>End Date:</strong>{" "}
                            {reservation.endDate
                                ? ((d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)(new Date(reservation.endDate)))
                                : "-"}
                        </p>

                        <p><strong>Payment Status:</strong> <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[reservation.paymentStatus]}`}>{reservation.paymentStatus}</span></p>
                        <p><strong>Amount Paid:</strong> ₦{reservation.invoices.amountPaid.toLocaleString()}</p>
                        <p className="col-span-2"><strong>Event Description:</strong> {reservation.description}</p>
                    </div>
                </div>

                {showInvoice && (
                    <InvoiceModal
                        invoices={[reservation.invoices]}
                        onClose={() => setShowInvoice(false)}
                    />
                )}

                {/* Print Button */}
                <div className="flex justify-end">
                    <div>
                        {reservation && reservation.invoices && (
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

                    {/*<button*/}
                    {/*    onClick={onPrint}*/}
                    {/*    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"*/}
                    {/*>*/}
                    {/*    <Printer size={16} />*/}
                    {/*    Print Receipt*/}
                    {/*</button>*/}
                </div>
            </div>
            {showConfirm && (
                <ConfirmModal
                    message={modalMessage}
                    onConfirm={confirmSubmission}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {showModal && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => setShowModal(false)}
                />
            )}

            {/* ✅ On Successful */}
            {showSuccessModal && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => onSuccess()}
                />
            )}
        </div>
    );
};

export default SingleHallReservation;
