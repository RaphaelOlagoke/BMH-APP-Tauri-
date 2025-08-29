import React, {useEffect, useState} from 'react';
import {getData, logoImg, roomList} from "../utils/index.js";
import {ArrowLeft, Plus, Trash2, CheckCircle, Trash} from 'lucide-react';
import {useLocation, useNavigate} from 'react-router-dom';
import ConfirmModal from "../components/ConfirmModal.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import restClient from "../utils/restClient.js";


const idTypes = ['DRIVER_LICENSE', 'NIN', 'PASSPORT', 'VOTER_CARD'];

const CheckInForm = () => {

    const [guest, setGuest] = useState({
        name: '',
        phone: '',
        nextOfKin: '',
        nextOfKinPhone: '',
        idType: '',
        idRef: '',
    });

    const [roomType, setRoomType] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [numDays, setNumDays] = useState(1);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [discountCode, setDiscountCode] = useState('');

    const [showConfirm, setShowConfirm] = useState(false);
    const [showReservationCancelConfirm, setShowReservationCancelConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();

    const [roomTypes, setRoomTypes] = useState([]);
    const [availableRooms, setAvailableRooms] = useState({});
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [roomPriceData, setRoomPriceData] = useState({});
    const [roomPriceMap, setRoomPriceMap] = useState({});
    const [discountDetails, setDiscountDetails] = useState(null);
    const [discountError, setDiscountError] = useState('');

    // const [roomDtoList, setRoomDtoList] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const fetchedRoomDtoList = await roomList(navigate);
            const fetchedRoomPriceData = await getData("/roomPrices/all", navigate);


            if (!fetchedRoomDtoList || !fetchedRoomPriceData) {
                setModalMessage("Something went wrong!");
                setShowMissingFields(true);
                return
            }


            // setRoomDtoList(fetchedRoomDtoList);
            // setRoomPriceData(fetchedRoomPriceData);
            //
            // console.log("roomDto",roomDtoList);
            // console.log("roomPriceData",roomPriceData)

            const roomPriceMap = {
                EXECUTIVE_SUITE: fetchedRoomPriceData.executiveSuitePrice,
                BUSINESS_SUITE: fetchedRoomPriceData.businessSuiteAPrice,
                STANDARD: fetchedRoomPriceData.businessSuiteBPrice,
                EXECUTIVE_DELUXE: fetchedRoomPriceData.executiveDeluxePrice,
                DELUXE: fetchedRoomPriceData.deluxePrice,
                CLASSIC: fetchedRoomPriceData.classicPrice,
                SUB_CLASSIC: fetchedRoomPriceData.subClassicPrice,
            };

            const roomTypesSet = new Set();
            const tempAvailableRooms = {};

            fetchedRoomDtoList?.forEach(room => {
                const type = room.roomType;

                if (!roomPriceMap[type]) return;

                roomTypesSet.add(type);

                if (room.roomStatus === "AVAILABLE" && !room.needsCleaning) {
                    if (!tempAvailableRooms[type]) {
                        tempAvailableRooms[type] = [];
                    }
                    tempAvailableRooms[type].push(String(room.roomNumber));
                }
            });

            const roomTypesArray = Array.from(roomTypesSet).map(type => ({
                type,
                price: roomPriceMap[type]
            }));

            setRoomTypes(roomTypesArray);
            setAvailableRooms(tempAvailableRooms);
        };

        fetchRooms();
    }, []);


    const validateDiscount = async () => {
        if (!discountCode) {
            setDiscountDetails(null);
            return;
        }

        try {
            const res = await restClient.get(`/discount/code?code=${discountCode}`, navigate);

            if (res?.responseHeader?.responseCode === "00" && res.data) {
                const discount = res.data;

                const now = new Date();
                const validFrom = new Date(discount.startDate);
                const validTo = new Date(discount.endDate);

                const isValid =
                    discount.active &&
                    now >= validFrom &&
                    now <= validTo;

                if (isValid) {
                    setDiscountDetails(discount);
                    setDiscountError('');
                } else {
                    setDiscountDetails(null);
                    setDiscountError('Discount code is expired or invalid.');
                }
            } else {
                setDiscountDetails(null);
                setDiscountError('Discount code not found.');
            }
        } catch (error) {
            console.error("Failed to validate discount:", error);
            setDiscountDetails(null);
            setDiscountError('Failed to validate discount code.');
        }
    };


    useEffect(() => {
        validateDiscount();
    }, [discountCode]);



    const handleAddRoom = () => {
        if (!selectedRoom || !roomType) return;

        const alreadySelected = selectedRooms.some(
            (room) => room.room === selectedRoom
        );

        if (alreadySelected) {
            setModalMessage("This room has already been selected.")
            setShowMissingFields(true);
            return;
        }

        const price = roomTypes.find((r) => r.type === roomType)?.price || 0;

        const newRoom = {
            type: roomType,
            room: selectedRoom,
            price,
        };

        setSelectedRooms([...selectedRooms, newRoom]);
    };

    // useEffect(() => {
    //     setTotalPrice(selectedRooms.reduce((sum, room) => sum + room.price, 0) * numDays);
    //     setCurrentPrice(roomTypes.find(r => r.type === roomType)?.price || 0);
    // }, [selectedRoom, numDays, roomType, selectedRooms, roomTypes]);

    useEffect(() => {
        const basePrice = selectedRooms.reduce((sum, room) => sum + room.price, 0) * numDays;

        if (discountDetails?.percentage) {
            const discount = (discountDetails.percentage / 100) * basePrice;
            setTotalPrice(basePrice - discount);
        } else {
            setTotalPrice(basePrice);
        }

        setCurrentPrice(roomTypes.find(r => r.type === roomType)?.price || 0);
    }, [selectedRoom, numDays, roomType, selectedRooms, roomTypes, discountDetails]);


    const handleChange = (e) => {
        setGuest({ ...guest, [e.target.name]: e.target.value });
    };

    const handleCheckIn = (e) => {
        e.preventDefault();

        if (
            !guest.name ||
            !guest.phone ||
            !selectedRooms ||
            !numDays ||
            !paymentMethod ||
            selectedRooms.length === 0
        ) {
            setModalMessage("Please fill all required fields")
            setShowMissingFields(true);
        }
        else{
            setShowConfirm(true);
        }
    };

    const confirmSubmission = async () => {
        setShowConfirm(false);
        setLoading(true);
        const checkInRequest = {
            guestName: guest.name,
            roomNumbers: selectedRooms.map(r => r.room),
            paymentMethod: paymentMethod,
            discountCode: discountCode,
            noOfDays: numDays,
            idType: guest.idType || null,
            idRef: guest.idRef,
            nextOfKinName: guest.nextOfKin,
            nextOfKinNumber: guest.nextOfKinPhone,
            phoneNumber: guest.phone
        };
        console.log(checkInRequest);
        try {
            const res = await restClient.post("/guestLog/", checkInRequest, navigate);
            console.log(res)
            if(res.data && res.responseHeader.responseCode === "00") {
                setModalMessage("Check In Successful!");
                setShowSuccessModal(true);
                if(reservationData) {
                    await restClient.post(`/reservation/update?ref=${reservationData.ref}`, {}, navigate);
                }
            }
            else{
                setModalMessage(res.error ?? "Something went wrong!");
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
        if(reservationData){
            navigate("/room-reservation");
        }
        else{
            navigate("/home")
        }
    }

    const cancelReservation = async () => {
        setShowReservationCancelConfirm(true)
    }

    const handleCancelReservation = async () => {
        setShowReservationCancelConfirm(false);
        setLoading(true);
        try {
            const res = await restClient.post(`/reservation/cancel?ref=${reservationData.ref}`, {}, navigate);
            console.log(res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("Reservation canceled successfully");
                setShowSuccessModal(true);
            }
            else{
                setModalMessage(res.error ?? "Something went wrong!");
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
    }

    const location = useLocation();
    const reservationData = location.state?.reservation;

    const paymentMethods = ["CARD", "CASH", "TRANSFER"];

    useEffect(() => {
        const prefillReservationData = async () => {
            if (!reservationData) return;

            // Fetch price data first
            const roomPriceDataFetched = await getData("/roomPrices/all", navigate);
            if (!roomPriceDataFetched) {
                setModalMessage("Something went wrong!");
                setShowMissingFields(true);
                return;
            }

            setRoomPriceData(roomPriceDataFetched);

            const localRoomPriceMap = {
                EXECUTIVE_SUITE: roomPriceDataFetched.executiveSuitePrice,
                BUSINESS_SUITE: roomPriceDataFetched.businessSuiteAPrice,
                STANDARD: roomPriceDataFetched.businessSuiteBPrice,
                EXECUTIVE_DELUXE: roomPriceDataFetched.executiveDeluxePrice,
                DELUXE: roomPriceDataFetched.deluxePrice,
                CLASSIC: roomPriceDataFetched.classicPrice,
                SUB_CLASSIC: roomPriceDataFetched.subClassicPrice,
            };

            // Now you can safely use localRoomPriceMap
            const newSelectedRooms = reservationData.roomNumbers.map((room) => ({
                room: room.roomNumber,
                type: room.roomType,
                price: localRoomPriceMap[room.roomType] || 0
            }));

            setRoomPriceMap(localRoomPriceMap); // still update state
            setSelectedRooms(newSelectedRooms);
            setGuest({
                name: reservationData.guestName || '',
                phone: reservationData.guestPhoneNumber || '',
                nextOfKin: reservationData.nextOfKin || '',
                nextOfKinPhone: reservationData.nextOfKinPhone || '',
                idType: reservationData.idType || '',
                idRef: reservationData.idRef || ''
            });

            setRoomType(reservationData.roomType || '');
            setSelectedRoom(reservationData.roomNumber || '');

            setNumDays(reservationData.numDays || 1);

            const total = newSelectedRooms.reduce((sum, room) => sum + room.price, 0) * (reservationData.numDays || 1);

            setCurrentPrice(newSelectedRooms[0]?.price || 0);
            setTotalPrice(total);
        };

        prefillReservationData();
    }, [reservationData]);



    return (
        <div>
            {loading && <LoadingScreen />}
            <div className="flex items-center pt-5 ps-5 space-x-2 mb-4 cursor-pointer" onClick={() => navigate(-1)}>
                <ArrowLeft className="text-gray-700" />
                <span className="text-sm text-gray-700">Back</span>
            </div>

            <div className="flex justify-center items-center px-8 py-3 w-full">
                <form onSubmit={handleCheckIn} className="p-6 bg-white rounded-lg shadow-lg space-y-6 w-full">
                    <div className="flex space-x-12 justify-start py-5">
                        <img className="w-12 h-12" src={logoImg} alt="logo" />
                        <div className="flex justify-center w-5/6">
                            <h2 className="text-3xl font-semibold mb-4">Guest Check-In</h2>
                        </div>
                    </div>

                    {/* Guest Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <input name="name" value={guest.name} onChange={handleChange} placeholder="Guest Name" className="input blue-input" />
                        <input name="phone" value={guest.phone} onChange={handleChange} placeholder="Phone Number" className="input blue-input" />
                        <input name="nextOfKin" value={guest.nextOfKin} onChange={handleChange} placeholder="Next of Kin" className="input blue-input" />
                        <input name="nextOfKinPhone" value={guest.nextOfKinPhone} onChange={handleChange} placeholder="Next of Kin Phone" className="input  blue-input" />
                        <select name="idType" value={guest.idType} onChange={handleChange} className="input blue-input">
                            <option value="">Select ID Type</option>
                            {idTypes.map((id) => <option key={id}>{id}</option>)}
                        </select>
                        <input name="idRef" value={guest.idRef} onChange={handleChange} placeholder="ID Reference" className="input blue-input" />
                    </div>

                    {/* Room Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="input blue-input">
                            <option value="">Filter by Room Type</option>
                            {roomTypes.map((r) => (
                                <option key={r.type} value={r.type}>{r.type}</option>
                            ))}
                        </select>

                        <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="input blue-input">
                            <option value="">Select Room</option>
                            {(availableRooms[roomType] || []).map((room) => (
                                <option key={room} value={room}>{room}</option>
                            ))}
                        </select>

                        <button type="button" onClick={handleAddRoom} className="bg-blue-600 text-white rounded px-4 py-2 w-1/2 hover:bg-blue-700">
                            <div className="flex items-center space-x-3 justify-center">
                                <Plus size={18} />
                                <p>Add Room</p>
                            </div>
                        </button>
                    </div>

                    {/* Selected Rooms List */}
                    {selectedRooms.length > 0 && (
                        <div className="border p-4 rounded bg-gray-50">
                            <h3 className="font-semibold mb-2">Selected Rooms:</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {selectedRooms.map((room, idx) => (
                                    <li key={idx} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                        <span>{room.type} Room - #{room.room} - ₦{roomPriceData ? roomPriceMap[room.type] : 0}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedRooms(selectedRooms.filter((_, i) => i !== idx))
                                            }
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </li>

                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-sm mb-1">Room Type Price</label>
                            <input value={`₦${currentPrice.toLocaleString()}`} disabled className="input bg-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Total Price</label>
                            <input value={`₦${totalPrice.toLocaleString()}`} disabled className="input bg-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Number of Days</label>
                            <input
                                type="number"
                                min={1}
                                value={numDays}
                                onChange={(e) => setNumDays(Number(e.target.value))}
                                className="input bg-blue-50 px-3"
                            />
                        </div>
                    </div>

                    {discountDetails && (
                        <div className="text-green-600 text-sm mt-1 text-start py-6">
                            {discountDetails.percentage}% discount applied
                        </div>
                    )}
                    {discountError && (
                        <div className="text-red-500 text-sm mt-1 text-start">{discountError}</div>
                    )}


                    <div className="flex items-center space-x-5">
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

                        <input
                            name="Discount"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Discount Code"
                            className="input blue-input" />
                    </div>


                    {reservationData ? (
                        <div className="flex items-center justify-between">
                            {/* Cancel reservation Button */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={cancelReservation}
                                    className="bg-red-600 text-white rounded px-6 py-2 w-max hover:bg-red-700 transition"
                                >
                                    <div className="flex items-center space-x-3 justify-center">
                                        <Trash2 size={18} />
                                        <p>Cancel Reservation</p>
                                    </div>
                                </button>
                            </div>

                            {/* Check-In Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white rounded px-6 py-2 w-max hover:bg-green-700 transition"
                                >
                                    <div className="flex items-center space-x-3 justify-center">
                                        <CheckCircle size={18} />
                                        <p>Check-In</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-end">
                            {/* Check-In Button */}
                            <button
                                type="submit"
                                className="bg-green-600 text-white rounded px-6 py-2 w-max hover:bg-green-700 transition"
                            >
                                <div className="flex items-center space-x-3 justify-center">
                                    <CheckCircle size={18} />
                                    <p>Check-In</p>
                                </div>
                            </button>
                        </div>
                    )}



                </form>
            </div>
            {/* ✅ Confirm Modal */}
            {showConfirm && (
                <ConfirmModal
                    message="Confirm Check-In?"
                    onConfirm={confirmSubmission}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {/* ✅ Confirm Cancel Modal */}
            {showReservationCancelConfirm && (
                <ConfirmModal
                    message="Cancel Reservation?"
                    onConfirm={handleCancelReservation}
                    onCancel={() => setShowReservationCancelConfirm(false)}
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
                    message={modalMessage}
                    onCancel={() => onSuccess()}
                />
            )}
        </div>

    );
};

export default CheckInForm;
