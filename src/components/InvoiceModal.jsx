import React, {useState} from 'react';
import {CheckCircle, Download, Printer} from "lucide-react";
import ConfirmModal from "./ConfirmModal.jsx";
import {useNavigate} from "react-router-dom";
import LoadingScreen from "./LoadingScreen.jsx";
import restClient, {BASE_URL} from "../utils/restClient.js";

const InvoiceModal = ({invoices, onClose}) => {
    const [invoiceData, setInvoiceData] = useState(invoices);
    const [showConfirm, setShowConfirm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");
    const [blobUrl, setBlobUrl] = useState('');
    const [showBlobModal, setShowBlobModal] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);



    const fetchAllInvoices = async () => {
        try {
            const promises = invoices.map(invoice =>
                restClient.get(`/invoice/ref?ref=${invoice.ref}`, navigate)
            );
            const results = await Promise.all(promises);

            const successful = [];
            let hasError = false;

            for (let res of results) {
                if (res.responseHeader.responseCode === "00") {
                    successful.push(res.data);
                } else {
                    hasError = true;
                    setModalMessage(res.error ?? "Something went wrong!");
                    setShowModal(true);
                    break; // Optional: exit on first failure
                }
            }

            console.log(successful);
            setInvoiceData(successful);

            if (!hasError && successful.length > 0) {
                setModalMessage("Successful");
                setShowModal(true);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setModalMessage("Something went wrong!");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };


    // const onSubmit = async () => {
    //     setLoading(true);
    //     await fetchAllInvoices();
    // }

    const handleConfirmPaid = async () => {
        // onMarkPaid(); // handle marking all invoices as paid
        setShowConfirm(false);
        setLoading(true);
        try {
            const request = {
                paymentMethod: paymentMethod,
                invoiceRefs: invoiceData
                    .filter((invoice) => invoice.paymentStatus === "UNPAID")
                    .map((invoice) => invoice.ref),
            }
            const res = await restClient.post('/invoice/resolve', request, navigate);
            console.log("Add Room",res)
            if (res.responseHeader.responseCode === "00") {
                await fetchAllInvoices();

                setModalMessage("Successful");
                setShowModal(true);
            } else {
                setModalMessage(res.error ?? "Something went wrong!");
                setShowModal(true);
            }
        }
            // eslint-disable-next-line no-unused-vars
        catch (error) {
            setModalMessage("Something went wrong!");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };


    // const totalOutstanding = invoices.reduce(
    //     (sum, invoice) => sum + (invoice.totalAmount - (invoice.amountPaid + invoice.discountAmount)),
    //     0
    // );

    const allPaid = invoiceData.every(invoice => invoice.paymentStatus === "PAID");


    const paymentMethods = ["CASH", "CARD", "TRANSFER"]

    const statusStyles = {
        PAID: "bg-green-100 text-green-800",
        UNPAID: "bg-yellow-200 text-yellow-700",
        REFUNDED: "bg-blue-200 text-blue-700",
        DEBIT: "bg-red-200 text-red-700",
    };

    const onSuccess = async () => {
        setShowSuccessModal(false)
        // await onSubmit();
    }

    async function downloadInvoice(ref) {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${BASE_URL}/invoice/download?ref=${ref}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/pdf',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch PDF');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Open PDF in new tab
            window.open(url, '_blank');
            openInSystemBrowser(url);
            setBlobUrl(`${BASE_URL}/invoice/download?ref=${ref}`);
            setShowBlobModal(true);

            // Optional: revoke the object URL later
            setTimeout(() => URL.revokeObjectURL(url), 5000);
        } catch (error) {
            console.error('Error opening PDF:', error);
            navigate('/login'); // or custom error handler
        }
    }

    function openInSystemBrowser(url) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    async function printInvoice(ref) {
        const token = localStorage.getItem('token');
        const url = `${BASE_URL}/invoice/download?ref=${ref}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/pdf'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch invoice');

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const printWindow = window.open(blobUrl, '_blank');

            if (!printWindow) {
                throw new Error('Popup blocked or failed to open');
            }

            // Wait until PDF is loaded, then print
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };

            // Optional: cleanup
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        } catch (err) {
            console.error('Print failed:', err);
            setModalMessage('Print failed');
            setShowModal(true);
        }
    }



    // async function downloadInvoiceTauri(ref) {
    //     const token = localStorage.getItem('token');
    //     const url = `http://localhost:8080/api/v1/invoice/download?ref=${encodeURIComponent(ref)}`;
    //
    //     try {
    //         const savePath = await save({
    //             defaultPath: `invoice_${ref}.pdf`,
    //             filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
    //         });
    //
    //         if (!savePath) {
    //             console.log('User cancelled download');
    //             return;
    //         }
    //
    //         const response = await tauriFetch(url, {
    //             method: 'GET',
    //             responseType: 'Binary',
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //
    //         const bytes = new Uint8Array(response.data);
    //         await writeBinaryFile({ path: savePath, contents: bytes });
    //
    //         console.log('Invoice saved to', savePath);
    //     } catch (err) {
    //         console.error('Download failed:', err);
    //     }
    // }



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-[15px]">
            {loading && <LoadingScreen/>}
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl overflow-auto max-h-[80vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Invoice Detail</h2>
                    <button onClick={onClose} className="text-red-500">Close</button>
                </div>
                <div className="flex justify-between">

                    {allPaid ? (
                        <div className="flex justify-end w-full">
                            <span className="px-3 py-3 h-max rounded-2xl bg-green-100 text-green-800 text-sm">
                            All Paid
                        </span>
                        </div>

                    ) : (
                        <div className="flex justify-between w-full">
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

                            <button
                                onClick={() => setShowConfirm(true)}
                                className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
                            >
                                <CheckCircle size={18}/>
                                Mark All as Paid
                            </button>
                        </div>

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
                        ) :
                        <ConfirmModal
                            message="No Payment Method Selected"
                            onCancel={() => setShowConfirm(false)}
                        />
                )}

                {invoiceData.map((invoice) => (
                    <div className="text-start" key={invoice.ref}>
                        <p><strong>Service Type:</strong> {invoice.service}</p>
                        <p><strong>Service Description:</strong> {invoice.serviceDetails}</p>
                        <div className="flex items-center gap-4 py-2">
                            <p className="text-sm">
                                <strong>Status:</strong>
                            </p>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full
                                ${statusStyles[invoice.paymentStatus]}`}>
                                {invoice.paymentStatus}
                            </span>
                        </div>
                        <p>
                            <strong>Issue Date:</strong>{" "}
                            {invoice.issueDate
                                ? ((d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')},  ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)(new Date(invoice.issueDate)))
                                : "-"}
                        </p>

                        <p>
                            <strong>Payment Date:</strong>{" "}
                            {invoice.paymentDate
                                ? ((d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')},  ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)(new Date(invoice.paymentDate)))
                                : "-"}
                        </p>


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
                            {invoice.discountCode && (
                                <p><strong>Discount Percentage:</strong> {invoice.discountPercentage}%</p>)}
                            <p className="py-2"><strong>Subtotal:</strong> ₦{invoice.totalAmount}</p>
                            <p><strong>Amount Paid:</strong> ₦{invoice.amountPaid}</p>
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                                onClick={() => downloadInvoice(invoice.ref)}
                            >
                                <Download size={16}/> Download
                            </button>

                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                                onClick={() => printInvoice(invoice.ref)}
                            >
                                <Printer size={16}/> Print
                            </button>
                        </div>

                        <hr className="my-6 border-6 border-black"/>

                    </div>
                ))}

                {showModal && (
                    <ConfirmModal
                        message={modalMessage}
                        onCancel={() => setShowModal(false)}
                    />
                )}

                {showSuccessModal && (
                    <ConfirmModal
                        message={modalMessage}
                        onCancel={() => onSuccess()}
                    />
                )}

                {showBlobModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Copy this link to open PDF in your browser</h3>
                            {linkCopied && (
                                <div className="mb-2 text-green-700 text-sm font-medium">
                                    ✅ Link copied to clipboard!
                                </div>
                            )}

                            <input
                                type="text"
                                readOnly
                                value={blobUrl}
                                className="w-full border px-3 py-2 mb-4"
                                onFocus={e => e.target.select()}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(blobUrl);
                                        setLinkCopied(true);
                                        setTimeout(() => setLinkCopied(false), 3000);
                                    }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Copy Link
                                </button>
                                <button
                                    onClick={() => setShowBlobModal(false)}
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    )
};

export default InvoiceModal;