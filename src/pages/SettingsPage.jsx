import React, { useState } from 'react';
import BackButton from "../components/BackButton.jsx";
import Sidebar from "../components/Sidebar.jsx";
import {menuItems} from "../utils/index.js";
import ConfirmModal from "../components/ConfirmModal.jsx";


const SettingsPage = () => {
    const [roomPrices, setRoomPrices] = useState({
        classic: '',
        deluxe: '',
        executiveDeluxe: '',
        executiveSuiteA: '',
        executiveSuiteB: '',
        executiveSuite: '',
    });

    const [hallPrices, setHallPrices] = useState({
        conferenceRoom: '',
        meetingRoom: '',
        meetingHall: '',
    });

    const [additionalCharges, setAdditionalCharges] = useState({
        vat: '',
        tax: '',
    });

    const [activeSection, setActiveSection] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMissingFields, setShowMissingFields] = useState(false);

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
        if (!roomPrices.classic || !roomPrices.deluxe || !roomPrices.executiveDeluxe || !roomPrices.executiveSuiteA
            || !roomPrices.executiveSuiteB || !roomPrices.executiveSuite) {
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
        if (!hallPrices.conferenceRoom || !hallPrices.meetingRoom || !hallPrices.meetingHall ) {
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
        if (!additionalCharges.vat || !additionalCharges.tax ) {
            setShowMissingFields(true);
        }
        else{
            setActiveSection("Charge")
            setShowConfirm(true);
        }
    };

    const confirmSubmission = () => {
        console.log(`Updating Setting  ${activeSection}`);

        setShowConfirm(false);
    };

    return (
        <div className="flex" >
            <Sidebar menuItems={menuItems}/>
            <div className="px-20 py-5 bg-gray-50 min-h-screen space-y-10 text-start text-[15px] w-full">
                <h1 className="text-3xl font-bold mb-4">Settings</h1>

                {/* Room Prices Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Room Prices</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="classic" value={roomPrices.classic} onChange={handleRoomChange} placeholder="Classic Room" className="input" />
                        <input name="deluxe" value={roomPrices.deluxe} onChange={handleRoomChange} placeholder="Deluxe Room" className="input" />
                        <input name="executiveDeluxe" value={roomPrices.executiveDeluxe} onChange={handleRoomChange} placeholder="Executive Deluxe Room" className="input" />
                        <input name="executiveSuiteA" value={roomPrices.executiveSuiteA} onChange={handleRoomChange} placeholder="Executive Suite A Room" className="input" />
                        <input name="executiveSuiteB" value={roomPrices.executiveSuiteB} onChange={handleRoomChange} placeholder="Executive Suite B Room" className="input" />
                        <input name="executiveSuite" value={roomPrices.executiveSuite} onChange={handleRoomChange} placeholder="Executive Suite Room" className="input" />
                    </div>
                    <button onClick={updateRoomPrices} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update</button>
                </div>

                {/* Hall Prices Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Hall Prices</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="conferenceRoom" value={hallPrices.conferenceRoom} onChange={handleHallChange} placeholder="Conference Room" className="input" />
                        <input name="meetingRoom" value={hallPrices.meetingRoom} onChange={handleHallChange} placeholder="Meeting Room" className="input" />
                        <input name="meetingHall" value={hallPrices.meetingHall} onChange={handleHallChange} placeholder="Meeting Hall" className="input" />
                    </div>
                    <button onClick={updateHallPrices} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update</button>
                </div>

                {/* Additional Charges Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Additional Charges</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="vat" value={additionalCharges.vat} onChange={handleChargesChange} placeholder="VAT (%)" className="input" />
                        <input name="tax" value={additionalCharges.tax} onChange={handleChargesChange} placeholder="Tax (%)" className="input" />
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
        </div>
    );
};

export default SettingsPage;
