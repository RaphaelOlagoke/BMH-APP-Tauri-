import React, {useEffect, useState} from 'react';
import {
    CupSoda,
    Drumstick,
    LogIn,
    Minus,
    Pencil,
    Pizza,
    Plus,
    PlusCircle,
    Sandwich,
    Trash2,
    Utensils
} from 'lucide-react';
import CreateButton from "../components/CreateButton.jsx";
import CreateMenuItem from "../Modals/CreateMenuItem.jsx";
import UpdateMenuItem from "../Modals/UpdateMenuItem.jsx";
import BackButton from "../components/BackButton.jsx";
import {Link, useNavigate} from "react-router-dom";
import PaymentConfirmation from "../Modals/PaymentConfirmation.jsx";
import ChargeToRoom from "../Modals/ChargeToRoom.jsx";
import Header from "../components/Header.jsx";
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import {getUser} from "../utils/index.js";

const categories = ['All', 'Appetizer', 'Mains', 'Dessert', 'Sides', 'Beverage', 'Specials'];
const categoryOptions = ['APPETIZER', 'MAINS', 'DESSERT', 'SIDES', 'BEVERAGE', 'SPECIALS'];

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
    const [showConfirmChargeToRoomModal, setShowConfirmChargeToRoomModal] = useState(false);
    const [showChargeToRoomModal, setShowChargeToRoomModal] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState("");
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();
    const [vatPercentage, setVatPercentage] = useState(0);
    const [taxPercentage, setTaxPercentage] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [rooms, setRooms] = useState([]);
    // const [guestInfo, setGuestInfo] = useState({});

    const filteredItems = menuItems.filter(
        (item) =>
            (selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase()) &&
            item.name.toLowerCase().includes(search.toLowerCase())
    );

    const addToBill = (item) => {
        setBillItems((prev) => {
            const existing = prev.find((i) => i.ref === item.ref);
            if (existing) {
                return prev.map((i) =>
                    i.ref === item.ref ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                return [...prev, { ...item, quantity: 1 }];
            }
        });
    };

    const loadMenuItemsData = async () => {
        // if(roomsList.length === 0){
        //     loadRoomSummaryData();
        // }
        setLoading(true);
        try {
            const res = await restClient.get('/restaurant/',navigate);
            // console.log(res)
            if (res?.responseHeader?.responseCode === "00") {
                setMenuItems(res.data);
            }
            else{
                setModalMessage(res.error ?? "Something went wrong!");
                setShowModal(true);
            }
        } catch (error) {
            console.log(error);
            setModalMessage( "Something went wrong!");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    // const loadAdditionalChargeItems = async () => {
    //     setLoading(true);
    //     try {
    //         const additionalChargeData = await getData("/additionalCharge/",navigate)
    //         // console.log(res)
    //         if (additionalChargeData) {
    //             setTaxPercentage(additionalChargeData.taxPrice);
    //             setVatPercentage(additionalChargeData.vatPrice);
    //         }
    //         else{
    //             setModalMessage( "Something went wrong!");
    //             setShowModal(true);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         setModalMessage( "Something went wrong!");
    //         setShowModal(true);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    useEffect(() => {
        loadMenuItemsData();
        setVatPercentage(0);
        setTaxPercentage(0);
        // loadAdditionalChargeItems()
    },[])

    const onSubmit = async () => {
        await loadMenuItemsData();
    }

    const handleEdit = (item) => {
        setSelectedMenu(item);
        setShowUpdateModal(true);
    }

    const handleProceedToPay = () => {
        setShowConfirmPaymentModal(true);
    }

    const handlePayment = async () => {
        // console.log("Confirming Payment...");
        setLoading(true);
        try {
            const request = {
                customerName: customerName,
                items: billItems,
                paymentMethod: selectedPayment,
                discount: 0,
                tax: taxPercentage,
                roomNumber: 0,
                discountCode: null,
            }
            const res = await restClient.post('/restaurant/order/', request, navigate);
            // console.log("Add Room",res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage("Order Created");
                setShowSuccessModal(true);
            }
            else{
                setModalMessage(res.error ?? "Something went wrong!");
                setShowModal(true);
            }
        }
            // eslint-disable-next-line no-unused-vars
        catch (error) {
            setModalMessage("Something went wrong!");
            setShowModal(true);
        }
        finally {
            setLoading(false);
        }
    }

    const onSuccess = () => {
        setShowSuccessModal(false)
        setShowConfirmPaymentModal(false);
        setBillItems([])
    }

    const handleChargeToRoomModal = () => {
        setShowChargeToRoomModal(true);
    }


    const handleChargeToRoom = async () =>{
        setShowConfirmChargeToRoomModal(false);
        setLoading(true);
        try {
            const request = {
                customerName: customerName,
                items: billItems,
                paymentMethod: "NONE",
                discount: 0,
                tax: taxPercentage,
                roomNumber: selectedRoom,
                discountCode: null,
            }
            const res = await restClient.post('/restaurant/order/chargeToRoom', request, navigate);
            // console.log("Add Room",res)
            if(res.responseHeader.responseCode === "00") {
                setShowChargeToRoomModal(false);
                setModalMessage("Order Created");
                setShowSuccessModal(true);
            }
            else{
                setModalMessage(res.error ?? "Something went wrong!");
                setShowModal(true);
            }
        }
            // eslint-disable-next-line no-unused-vars
        catch (error) {
            setModalMessage("Something went wrong!");
            setShowModal(true);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            try {
                const res = await restClient.get("/room/status?roomStatus=OCCUPIED",navigate);
                // console.log(res)
                if(res.responseHeader.responseCode === "00") {
                    const data = res.data;
                    setRooms(data)
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
        fetchRooms();
    }, [])


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
    const discount = 0;
    const tax = subtotal * (taxPercentage / 100);
    const vat = subtotal * (vatPercentage / 100);
    const total = subtotal - discount + tax + vat;

    const logout = async () => {
        setLoading(true);
        try {
            await restClient.postWithoutToken('/auth/logout', {});
        } catch (err) {
            console.error("Logout request failed:", err);
        } finally {
            localStorage.clear();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col bg-gray-100 min-h-screen">
            {loading && <LoadingScreen />}
            <div className="flex space-x-[600px] items-center py-3">
                {getUser().department === "RESTAURANT_BAR" ? (
                    <button
                        onClick={logout}
                        className={`flex items-center gap-3 px-3 py-2 rounded transition-all hover:bg-gray-700 hover:text-white text-black`}
                    >
                        <LogIn size={18} />
                        Logout
                    </button>
                    )
                    :
                    (
                    <BackButton/>
                )}
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
                                    onSubmit={onSubmit}
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
                                key={item.ref}
                                className="relative bg-white p-4 rounded-lg shadow flex flex-col justify-between"
                            >
                                {/* Edit Icon */}
                                {getUser().department === "SUPER_ADMIN" && (
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="absolute top-2 right-2 text-blue-600"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                )}

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
                                <div key={item.ref} className="flex justify-around text-sm">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setBillItems(prev =>
                                                    prev.map(i =>
                                                        i.ref === item.ref && i.quantity > 1
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
                                                        i.ref === item.ref
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
                                            setBillItems((prev) => prev.filter((i) => i.ref !== item.ref))
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
                        {/*<div className="flex justify-between">*/}
                        {/*    <span>{`Tax (${taxPercentage}%)`}:</span>*/}
                        {/*    <span>₦{tax.toLocaleString()}</span>*/}
                        {/*</div>*/}
                        {/*<div className="flex justify-between">*/}
                        {/*    <span>{`Vat (${vatPercentage}%)`}:</span>*/}
                        {/*    <span>₦{vat.toLocaleString()}</span>*/}
                        {/*</div>*/}
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
                        onSubmit={onSubmit}
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
                        billItems={billItems}
                        subtotal={subtotal}
                        discount={discount}
                        total={total}
                        onSubmit={() => setShowConfirmChargeToRoomModal(true)}
                        onClose={() => setShowChargeToRoomModal(false)}
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
                {showConfirmChargeToRoomModal && (
                    <ConfirmModal
                        message="Are you sure you want to charge items to this room?"
                        onConfirm={handleChargeToRoom}
                        onCancel={() => setShowConfirmChargeToRoomModal(false)}
                    />
                )}
            </div>
        </div>

    );
};

export default RestaurantPage;
