import React, {useEffect, useState} from 'react';
import {getData, logoImg, postData, roomList} from "../utils/index.js";
import { ArrowLeft, Plus, Trash2, CheckCircle } from 'lucide-react';
import {useLocation, useNavigate} from 'react-router-dom';
import ConfirmModal from "../components/ConfirmModal.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";


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
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();

    const [roomTypes, setRoomTypes] = useState([]);
    const [availableRooms, setAvailableRooms] = useState({});
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            const roomDtoList = await roomList(navigate);

            const roomPriceData = await getData("/roomPrices/all",navigate)
            if(!roomPriceData  || !roomDtoList){
                setModalMessage("Something went wrong!");
                setShowMissingFields(true);
                return;
            }

            const roomPriceMap = {
                EXECUTIVE_SUITE: roomPriceData.executiveSuitePrice,
                BUSINESS_SUITE_A: roomPriceData.businessSuiteAPrice,
                BUSINESS_SUITE_B: roomPriceData.businessSuiteBPrice,
                EXECUTIVE_DELUXE: roomPriceData.executiveDeluxePrice,
                DELUXE: roomPriceData.deluxePrice,
                CLASSIC: roomPriceData.classicPrice,
            };

            const roomTypesSet = new Set();
            const tempAvailableRooms = {};

            roomDtoList?.forEach(room => {
                const type = room.roomType;

                if (!roomPriceMap[type]) return;

                roomTypesSet.add(type);

                if (room.roomStatus === "AVAILABLE") {
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

    useEffect(() => {
        setTotalPrice(selectedRooms.reduce((sum, room) => sum + room.price, 0) * numDays);
        setCurrentPrice(roomTypes.find(r => r.type === roomType)?.price || 0);
    }, [selectedRoom, numDays, roomType, selectedRooms, roomTypes]);

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
            idType: guest.idType,
            idRef: guest.idRef,
            nextOfKinName: guest.nextOfKin,
            nextOfKinNumber: guest.nextOfKinPhone,
            phoneNumber: guest.phone
        };
        console.log(checkInRequest);
        const res = await postData("/guestLog/", checkInRequest, navigate);
        console.log("res",res)
        setLoading(false);
        if (res) {
            setShowSuccessModal(true);
        }
        else{
            setModalMessage("Something went wrong!");
            setShowMissingFields(true);
        }

    };

    const onSuccess = () => {
        setShowSuccessModal(false)
        navigate("/home")
    }

    const location = useLocation();
    const reservationData = location.state?.reservation;

    const paymentMethods = ["CARD", "CASH", "TRANSFER"];

    useEffect(() => {
        if (reservationData) {
            // Prefill guest info
            setGuest({
                name: reservationData.name || '',
                phone: reservationData.phone || '',
                nextOfKin: reservationData.nextOfKin || '',
                nextOfKinPhone: reservationData.nextOfKinPhone || '',
                idType: reservationData.idType || '',
                idRef: reservationData.idRef || ''
            });


            // Prefill room info
            setRoomType(reservationData.roomType || '');
            setSelectedRoom(reservationData.roomNumber || '');

            // Optional: add room to selectedRooms if needed
            const newSelectedRooms = reservationData.roomList.map((room) => ({
                room: room.number,
                type: room.type,
                price: room.price
            }));

            setSelectedRooms(newSelectedRooms);

            // if (reservationData.rooms && reservationData.roomTypes && reservationData.price) {
            //     setSelectedRooms([
            //         {
            //             room: reservationData.roomNumber,
            //             type: reservationData.roomType,
            //             price: reservationData.price
            //         }
            //     ]);
            // }

            // Set number of days
            setNumDays(reservationData.numDays || 1);

            // Set total and current price
            setCurrentPrice(reservationData.price || 0);
            setTotalPrice((reservationData.price || 0) * (reservationData.numDays || 1));
        }
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
                                        <span>{room.type} Room - #{room.room} - ₦{room.price.toLocaleString()}</span>
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

                    <div className="flex items-center space-x-5 py-6">
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

                        <input name="Discount" value={discountCode} onChange={setDiscountCode} placeholder="Discount Code" className="input blue-input" />
                    </div>


                    {/* Check-In Button */}
                    <div className="flex justify-end">
                        <button type="submit" className="bg-green-600 text-white rounded px-6 py-2 w-max hover:bg-green-700 transition">
                            <div className="flex items-center space-x-3 justify-center">
                                <CheckCircle size={18} />
                                <p>Check-In</p>
                            </div>
                        </button>
                    </div>

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
                    message="Check In Successful!"
                    onCancel={() => onSuccess()}
                />
            )}
        </div>

    );
};

export default CheckInForm;
