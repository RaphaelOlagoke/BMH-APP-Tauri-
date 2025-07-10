import React, {useEffect, useState} from 'react';
import BackButton from "../components/BackButton.jsx";
import Sidebar from "../components/Sidebar.jsx";
import {getData, menuItems} from "../utils/index.js";
import ConfirmModal from "../components/ConfirmModal.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import {useNavigate} from "react-router-dom";
import restClient from "../utils/restClient.js";


const SettingsPage = () => {
    const [roomPrices, setRoomPrices] = useState({
        EXECUTIVE_SUITE: "",
        BUSINESS_SUITE_A: "",
        BUSINESS_SUITE_B: "",
        EXECUTIVE_DELUXE: "",
        DELUXE: "",
        CLASSIC: "",
    });

    const [hallPrices, setHallPrices] = useState({
        CONFERENCE_ROOM: "",
        MEETING_ROOM: "",
        MEETING_HALL: ""
    });

    const [additionalCharges, setAdditionalCharges] = useState({
        VAT: '',
        TAX: '',
    })

    const [activeSection, setActiveSection] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const roomPriceData = await getData("/roomPrices/all",navigate)
            const hallPriceData = await restClient.get("/hallPrices/all",navigate);
            const additionalChargeData = await getData("/additionalCharge/",navigate)

            // console.log("RoomPriceData", roomPriceData);
            // console.log("HallPriceData", hallPriceData);
            // console.log("AdditionalChargeData", additionalChargeData);

            if(!roomPriceData) {
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

            setRoomPrices(roomPriceMap);

            if(hallPriceData.responseHeader.responseCode === "00") {
                const data = hallPriceData.data;
                // console.log(data)
                setHallPrices({
                    CONFERENCE_ROOM: data.conferenceHallPrice,
                    MEETING_ROOM: data.meetingRoomPrice,
                    MEETING_HALL: data.meetingHallPrice,
                })
            }

            if(additionalChargeData) {
                const data = additionalChargeData;
                // console.log(data)
                setAdditionalCharges({
                    VAT: data.vatPrice,
                    TAX: data.taxPrice,
                })
            }
        }
            // eslint-disable-next-line no-unused-vars
        catch (error) {
            setModalMessage("Something went wrong!")
            setShowModal(true)
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSettings();
    }, [])



    const handleRoomChange = (e) => {
        const { name, value } = e.target;
        setRoomPrices((prev) => ({ ...prev, [name]: value }));
    };

    const handleHallChange = (e) => {
        const { name, value } = e.target;
        setHallPrices((prev) => ({ ...prev, [name]: value }));
    };

    const handleChargesChange = (e) => {
        const { name, value } = e.target;
        setAdditionalCharges((prev) => ({ ...prev, [name]: value }));
    };

    const updateRoomPrices = () => {
        console.log('Updating Room Prices:', roomPrices);
        // API call here
        if (!roomPrices.CLASSIC || !roomPrices.DELUXE || !roomPrices.EXECUTIVE_DELUXE || !roomPrices.BUSINESS_SUITE_A
            || !roomPrices.BUSINESS_SUITE_B || !roomPrices.EXECUTIVE_SUITE) {
            setShowMissingFields(true);
        }
        else{
            setActiveSection("Room")
            setShowConfirm(true);
        }
    };

    const updateHallPrices = () => {
        console.log('Updating Hall Prices:', hallPrices);
        // API call here
        if (!hallPrices.CONFERENCE_ROOM || !hallPrices.MEETING_HALL || !hallPrices.MEETING_ROOM ) {
            setShowMissingFields(true);
        }
        else{
            setActiveSection("Hall")
            setShowConfirm(true);
        }
    };

    const updateCharges = () => {
        console.log('Updating Additional Charges:', additionalCharges);
        // API call here
        if (!additionalCharges.VAT || !additionalCharges.TAX ) {
            setShowMissingFields(true);
        }
        else{
            setActiveSection("Charge")
            setShowConfirm(true);
        }
    };

    const confirmSubmission = async () => {
        // console.log(`Updating Setting  ${activeSection}`);
        setShowConfirm(false);
        setLoading(true);
        try {
            var request = {}
            var endpoint = "";
            if(activeSection === "Room"){
                request = {
                    executiveSuitePrice: roomPrices.EXECUTIVE_DELUXE,
                    businessSuiteAPrice: roomPrices.BUSINESS_SUITE_A,
                    businessSuiteBPrice: roomPrices.BUSINESS_SUITE_B,
                    executiveDeluxePrice: roomPrices.EXECUTIVE_DELUXE,
                    deluxePrice: roomPrices.DELUXE,
                    classicPrice : roomPrices.CLASSIC,

                };
                endpoint = "/roomPrices/update";
            }
            else if (activeSection === "Hall") {
                request = {
                    conferenceHallPrice: hallPrices.CONFERENCE_ROOM,
                    meetingHallPrice: hallPrices.MEETING_HALL,
                    meetingRoomPrice: hallPrices.MEETING_ROOM,

                };
                endpoint = "/hallPrices/update";
            }
            else if (activeSection === "Charge") {
                request = {
                    vatPrice: additionalCharges.VAT,
                    taxPrice: additionalCharges.TAX,
                };
                endpoint = "/additionalCharge/update";
            }
            const res = await restClient.post(endpoint, request, navigate);
            console.log("Create User",res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("Prices Updated");
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
    };

    const onSuccess = () => {
        setShowSuccessModal(false)
        fetchSettings();
    }

    return (
        <div className="flex" >
            {loading && <LoadingScreen />}
            <Sidebar menuItems={menuItems}/>
            <div className="px-20 py-5 bg-gray-50 min-h-screen space-y-10 text-start text-[15px] w-full">
                <h1 className="text-3xl font-bold mb-4">Settings</h1>

                {/* Room Prices Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Room Prices</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="CLASSIC" className="block font-medium mb-1">Classic Room</label>
                            <input id="CLASSIC" name="CLASSIC" value={roomPrices.CLASSIC} onChange={handleRoomChange} className="input" />
                        </div>
                        <div>
                            <label htmlFor="DELUXE" className="block font-medium mb-1">Deluxe Room</label>
                            <input id="DELUXE" name="DELUXE" value={roomPrices.DELUXE} onChange={handleRoomChange} className="input" />
                        </div>
                        <div>
                            <label htmlFor="EXECUTIVE_DELUXE" className="block font-medium mb-1">Executive Deluxe Room</label>
                            <input id="EXECUTIVE_DELUXE" name="EXECUTIVE_DELUXE" value={roomPrices.EXECUTIVE_DELUXE} onChange={handleRoomChange} className="input" />
                        </div>
                        <div>
                            <label htmlFor="BUSINESS_SUITE_A" className="block font-medium mb-1">Business Suite A Room</label>
                            <input id="BUSINESS_SUITE_A" name="BUSINESS_SUITE_A" value={roomPrices.BUSINESS_SUITE_A} onChange={handleRoomChange} className="input" />
                        </div>
                        <div>
                            <label htmlFor="BUSINESS_SUITE_B" className="block font-medium mb-1">Business Suite B Room</label>
                            <input id="BUSINESS_SUITE_B" name="BUSINESS_SUITE_B" value={roomPrices.BUSINESS_SUITE_B} onChange={handleRoomChange} className="input" />
                        </div>
                        <div>
                            <label htmlFor="EXECUTIVE_SUITE" className="block font-medium mb-1">Executive Suite Room</label>
                            <input id="EXECUTIVE_SUITE" name="EXECUTIVE_SUITE" value={roomPrices.EXECUTIVE_SUITE} onChange={handleRoomChange} className="input" />
                        </div>
                    </div>
                    <button onClick={updateRoomPrices} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update</button>
                </div>

                {/* Hall Prices Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Hall Prices</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="CONFERENCE_ROOM" className="block font-medium mb-1">Conference Room</label>
                            <input id="CONFERENCE_ROOM" name="CONFERENCE_ROOM" value={hallPrices.CONFERENCE_ROOM} onChange={handleHallChange} className="input" />
                        </div>
                        <div>
                            <label htmlFor="MEETING_ROOM" className="block font-medium mb-1">Meeting Room</label>
                            <input id="MEETING_ROOM" name="MEETING_ROOM" value={hallPrices.MEETING_ROOM} onChange={handleHallChange} className="input" />
                        </div>
                        <div>
                            <label htmlFor="MEETING_HALL" className="block font-medium mb-1">Meeting Hall</label>
                            <input id="MEETING_HALL" name="MEETING_HALL" value={hallPrices.MEETING_HALL} onChange={handleHallChange} className="input" />
                        </div>
                    </div>
                    <button onClick={updateHallPrices} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update</button>
                </div>

                {/* Additional Charges Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Additional Charges</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="VAT" className="block font-medium mb-1">VAT (%)</label>
                            <input id="VAT" name="VAT" value={additionalCharges.VAT} onChange={handleChargesChange} className="input" />
                        </div>
                        <div>
                            <label htmlFor="TAX" className="block font-medium mb-1">Tax (%)</label>
                            <input id="TAX" name="TAX" value={additionalCharges.TAX} onChange={handleChargesChange} className="input" />
                        </div>
                    </div>
                    <button onClick={updateCharges} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update</button>
                </div>

            </div>

            {showConfirm && (
                <ConfirmModal
                    message="Update Prices?"
                    onConfirm={confirmSubmission}
                    onCancel={() => setShowConfirm(false)}
                />
            )}


            {/* ✅ Missing Fields Modal */}
            {showMissingFields && (
                <ConfirmModal
                    message="Required Fields cannot be null"
                    onCancel={() => setShowMissingFields(false)}
                />
            )}
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
        </div>
    );
};

export default SettingsPage;
