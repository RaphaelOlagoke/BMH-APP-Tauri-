import React, { useState } from 'react';
import { X } from 'lucide-react';
import ConfirmModal from "../components/ConfirmModal.jsx";
import restClient from "../utils/restClient.js";
import {useNavigate} from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen.jsx";

const CreateHallReservation = ({
      onClose,
      onSubmit,
      hallTypes = [],
      idTypes = [],
      paymentMethods = []
  }) => {
    const [guest, setGuest] = useState({
        name: '',
        phone: '',
        nextOfKin: '',
        nextOfKinPhone: '',
        idType: '',
        idRef: '',
    });

    const [hallType, setHallType] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [eventDateTime, setEventDateTime] = useState('');
    const [description, setDescription] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);

    const selectedHall = hallTypes.find((h) => h.type === hallType);
    const price = selectedHall ? selectedHall.price : 0;

    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");

    const handleGuestChange = (e) => {
        const { name, value } = e.target;
        setGuest((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !guest.name ||
            !guest.phone ||
            !hallType ||
            !paymentMethod ||
            !eventDateTime ||
            !description
        ) {
            setModalMessage("Please fill all required fields");
            setShowMissingFields(true);
        }
        else{
            setShowConfirm(true);
        }
    };

    const confirmSubmission = async () => {
        setShowConfirm(false);
        setLoading(true);
        const createReservationRequest = {
            guestName: guest.name,
            idType: guest.idType || null,
            idRef: guest.idRef || null,
            nextOfKinName: guest.nextOfKin,
            nextOfKinNumber: guest.nextOfKinPhone,
            phoneNumber: guest.phone,
            hallType: hallType,
            startDate: eventDateTime,
            description: description,
            paymentMethod: paymentMethod
        };
        console.log(createReservationRequest);
        try {
            const res = await restClient.post("/hallLog/", createReservationRequest, navigate);
            console.log(res)
            if(res.data && res.responseHeader.responseCode === "00") {
                setShowSuccessModal(true);
            }
            else{
                setModalMessage(res.responseHeader.responseMessage ?? "Something went wrong!");
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center text-start text-xl ">
            {loading && <LoadingScreen />}
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Hall Reservation</h2>
                    <button type="button" onClick={onClose}>
                        <X className="text-red-500" />
                    </button>
                </div>

                {/* Guest Details */}
                <h3 className="font-medium mb-2">Guest Details</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <input
                        name="name"
                        value={guest.name}
                        onChange={handleGuestChange}
                        placeholder="Guest Name"
                        className="input blue-input"
                    />
                    <input
                        name="phone"
                        value={guest.phone}
                        onChange={handleGuestChange}
                        placeholder="Phone Number"
                        className="input blue-input"
                    />
                    <input
                        name="nextOfKin"
                        value={guest.nextOfKin}
                        onChange={handleGuestChange}
                        placeholder="Next of Kin"
                        className="input blue-input"
                    />
                    <input
                        name="nextOfKinPhone"
                        value={guest.nextOfKinPhone}
                        onChange={handleGuestChange}
                        placeholder="Next of Kin Phone"
                        className="input blue-input"
                    />
                    <select
                        name="idType"
                        value={guest.idType}
                        onChange={handleGuestChange}
                        className="input blue-input"
                    >
                        <option value="">Select ID Type</option>
                        {idTypes.map((id) => (
                            <option key={id} value={id}>
                                {id}
                            </option>
                        ))}
                    </select>
                    <input
                        name="idRef"
                        value={guest.idRef}
                        onChange={handleGuestChange}
                        placeholder="ID Reference"
                        className="input blue-input"
                    />
                </div>

                {/* Hall Details */}
                <h3 className="text-lg font-medium mb-2">Hall Details</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <select
                        value={hallType}
                        onChange={(e) => setHallType(e.target.value)}
                        className="input blue-input"
                    >
                        <option value="">Select Hall Type</option>
                        {hallTypes.map((h) => (
                            <option key={h.type} value={h.type}>
                                {h.type}
                            </option>
                        ))}
                    </select>

                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="input blue-input"
                    >
                        <option value="">Select Payment Method</option>
                        {paymentMethods.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>

                    <input
                        type="datetime-local"
                        value={eventDateTime}
                        onChange={(e) => setEventDateTime(e.target.value)}
                        className="input blue-input col-span-2"
                    />

                    <input
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        className="input blue-input col-span-2"
                    />
                </div>

                {/* Price */}
                <div className="mb-4">
                    <p className="text-sm font-medium">
                        Hall Price:{' '}
                        <span className="text-blue-600 font-semibold">
              ₦{price.toLocaleString()}
            </span>
                    </p>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        Submit
                    </button>
                </div>

                {/* ✅ Confirm Modal */}
                {showConfirm && (
                    <ConfirmModal
                        message="Are you sure you want to create this reservation?"
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
                {/* ✅ On Successful */}
                {showSuccessModal && (
                    <ConfirmModal
                        message="Reservation Created"
                        onCancel={() => onSuccess()}
                    />
                )}

            </form>
        </div>
    );
};

export default CreateHallReservation;
