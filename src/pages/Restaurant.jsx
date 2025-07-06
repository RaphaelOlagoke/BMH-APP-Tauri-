import React, { useState } from 'react';
import {CupSoda, Drumstick, Minus, Pencil, Pizza, Plus, PlusCircle, Sandwich, Trash2, Utensils} from 'lucide-react';
import CreateButton from "../components/CreateButton.jsx";
import CreateMenuItem from "../Modals/CreateMenuItem.jsx";
import UpdateMenuItem from "../Modals/UpdateMenuItem.jsx";
import BackButton from "../components/BackButton.jsx";
import {Link} from "react-router-dom";
import PaymentConfirmation from "../Modals/PaymentConfirmation.jsx";
import ChargeToRoom from "../Modals/ChargeToRoom.jsx";
import Header from "../components/Header.jsx";

const categories = ['All', 'Appetizer', 'Mains', 'Dessert', 'Sides', 'Beverage', 'Specials'];
const categoryOptions = ['APPETIZER', 'MAINS', 'DESSERT', 'SIDES', 'BEVERAGE', 'SPECIALS'];

const dummyMenuItems = [
    { id: 1, name: 'Burger', price: 2500, category: 'MAINS' },
    { id: 2, name: 'Fries', price: 1200, category: 'SIDES' },
    { id: 3, name: 'Cola', price: 800, category: 'BEVERAGE' },
    { id: 4, name: 'Ice Cream', price: 1500, category: 'DESSERT' },
    { id: 5, name: 'Spring Rolls', price: 1000, category: 'APPETIZER' },
];

const paymentMethods = ['CASH', 'CARD', 'TRANSFER'];


const RestaurantPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [billItems, setBillItems] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');

    const [customerName, setCustomerName] = useState('');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
    const [showChargeToRoomModal, setShowChargeToRoomModal] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState("");

    const filteredItems = dummyMenuItems.filter(
        (item) =>
            (selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase()) &&
            item.name.toLowerCase().includes(search.toLowerCase())
    );

    const addToBill = (item) => {
        setBillItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                return [...prev, { ...item, quantity: 1 }];
            }
        });
    };

    const handleEdit = (item) => {
        setSelectedMenu(item);
        setShowUpdateModal(true);
    }

    const handleProceedToPay = () => {
        setShowConfirmPaymentModal(true);
    }

    const handlePayment = () => {
        console.log("Confirming Payment...");
    }

    const handleChargeToRoomModal = () => {
        setShowChargeToRoomModal(true);
    }
    const handleChargeToRoom = () =>{

    }

    const rooms = [
        { id: '101', number: '101', type: 'Deluxe' },
        { id: '102', number: '102', type: 'Executive' },
    ];

    const guestInfo = {
        name: 'John Doe',
        rooms: ['101', '102']
    };

    const getIconByCategory = (category) => {
        switch (category) {
            case "BEVERAGE": return <CupSoda size={32} />;
            case "APPETIZER": return <Sandwich size={32} />;
            case "MAINS": return <Drumstick size={32} />;
            case "DESSERT": return <Pizza size={32} />;
            default: return <Utensils size={32} />;
        }
    };

    const subtotal = billItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = 0; // For now
    const tax = subtotal * 0.075;
    const total = subtotal - discount + tax;

    return (
        <div className="flex flex-col bg-gray-100 min-h-screen">
            <div className="flex space-x-[600px] items-center">
                <BackButton/>
                <Header headerText="Hello Evano 👋🏼," />
            </div>
            <div className="p-6 bg-gray-100 min-h-screen flex gap-6">
                {/* Menu Section */}
                <div className="w-3/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Restaurant Menu</h2>

                        <div className="p-4 my-3 me-3">
                            <div className="flex justify-end mb-4">
                                <CreateButton onClick={() => setShowCreateModal(true)} />
                            </div>

                            {showCreateModal && (
                                <CreateMenuItem
                                    categories = {categoryOptions}
                                    onClose={() => setShowCreateModal(false)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Menu..."
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg border ${
                                    selectedCategory === cat
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}

                        <Link
                            to="/restaurant-orders"
                            className={`px-4 py-2 ms-5 rounded-lg border bg-blue-600 text-white`}
                        >
                           Orders
                        </Link>
                    </div>

                    {/* Menu Items Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="relative bg-white p-4 rounded-lg shadow flex flex-col justify-between"
                            >
                                {/* Edit Icon */}
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="absolute top-2 right-2 text-blue-600"
                                >
                                    <Pencil size={16} />
                                </button>

                                <div className="flex flex-col items-center space-y-2">
                                    {/*<div className="w-10 h-10 bg-gray-300 rounded-full" />*/}
                                    <div className="mb-2 text-gray-500">
                                        {getIconByCategory(item.category)}
                                    </div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p>₦{item.price.toLocaleString()}</p>
                                </div>

                                <button
                                    onClick={() => addToBill(item)}
                                    className="mt-4 flex items-center justify-center gap-2 bg-green-600 text-white text-sm py-2 rounded hover:bg-green-700"
                                >
                                    <PlusCircle size={16} /> Add to Bill
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bill Section */}
                <div className="w-2/5 bg-white p-6 rounded-lg shadow space-y-6">
                    <h2 className="text-xl font-semibold">Current Bill</h2>

                    {/* Bill Items */}
                    <div className="space-y-3 max-h-64 overflow-auto">
                        {billItems.length === 0 ? (
                            <p className="text-gray-500">No items added.</p>
                        ) : (
                            billItems.map((item) => (
                                <div key={item.id} className="flex justify-around text-sm">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setBillItems(prev =>
                                                    prev.map(i =>
                                                        i.id === item.id && i.quantity > 1
                                                            ? { ...i, quantity: i.quantity - 1 }
                                                            : i
                                                    )
                                                );
                                            }}
                                            className="text-gray-600 hover:text-gray-800 p-1"
                                        >
                                            <Minus size={16} />
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() => {
                                                setBillItems(prev =>
                                                    prev.map(i =>
                                                        i.id === item.id
                                                            ? { ...i, quantity: i.quantity + 1 }
                                                            : i
                                                    )
                                                );
                                            }}
                                            className="text-gray-600 hover:text-gray-800 p-1"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <span>{item.name} x{item.quantity}</span>
                                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                                    <button
                                        onClick={() =>
                                            setBillItems((prev) => prev.filter((i) => i.id !== item.id))
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <hr />

                    {/* Summary */}
                    <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₦{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Discount:</span>
                            <span>₦{discount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax (7.5%):</span>
                            <span>₦{tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total:</span>
                            <span>₦{total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            disabled={billItems.length === 0}
                            onClick={handleChargeToRoomModal}
                            className={`px-4 py-2 rounded-lg border bg-blue-600 text-white disabled:opacity-50`}
                        >
                            Charge to Room
                        </button>
                    </div>
                    {/* Payment Method */}
                    <div>
                        <p className="font-semibold mb-2">Payment Method</p>
                        <div className="flex gap-3">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method}
                                    onClick={() => setSelectedPayment(method)}
                                    className={`px-4 py-2 rounded-lg border ${
                                        selectedPayment === method
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Proceed Button */}
                    <button
                        onClick={handleProceedToPay}
                        disabled={!selectedPayment || billItems.length === 0}
                        className="w-full mt-4 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        Proceed to Pay
                    </button>
                </div>

                {showUpdateModal && (
                    <UpdateMenuItem
                        item={selectedMenu}
                        categories ={categoryOptions}
                        onClose={() => setShowUpdateModal(false)}
                    />
                )}
                {showConfirmPaymentModal && (
                    <PaymentConfirmation
                        billItems={billItems}
                        subtotal={subtotal}
                        discount={discount}
                        total={total}
                        customerName={customerName}
                        setCustomerName={setCustomerName}
                        onSubmit={handlePayment}
                        onClose={() => setShowConfirmPaymentModal(false)}
                    />

                )}
                {showChargeToRoomModal && (
                    <ChargeToRoom
                        rooms={rooms}
                        selectedRoom={selectedRoom}
                        setSelectedRoom={setSelectedRoom}
                        guestInfo={guestInfo}
                        billItems={billItems}
                        subtotal={subtotal}
                        discount={discount}
                        total={total}
                        onSubmit={handleChargeToRoom()}
                        onClose={() => setShowChargeToRoomModal(false)}
                    />


                )}
            </div>
        </div>

    );
};

export default RestaurantPage;
