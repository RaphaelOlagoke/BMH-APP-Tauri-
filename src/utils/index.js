import loginSVG from "/assets/images/loginImg.svg";
import logo from "/assets/images/Logo.png";
import availableRooms from "/assets/images/availableRooms.png";
import occupiedRooms from "/assets/images/occupiedRooms.png";
import needsCleaningRooms from "/assets/images/needsCleaningRooms.png";
import maintenanceRooms from "/assets/images/maintenance.png";
import paid from "/assets/images/paid.png";
import unpaid from "/assets/images/unpaid.png";
import expenses from "/assets/images/expenses.png";
import sync from "/assets/images/sync.png";

import {
    BedDouble,
    Building2,
    CalendarDays,
    ClipboardList,
    FileText,
    Percent,
    Settings,
    Sparkles,
    Users,
    Utensils
} from "lucide-react";
import restClient from "./restClient.js";


export const loginSVGImg = loginSVG;
export const logoImg = logo;
export const availableRoomsImg = availableRooms;
export const occupiedRoomsImg = occupiedRooms;
export const needsCleaningRoomsImg = needsCleaningRooms;
export const maintenanceRoomsImg = maintenanceRooms;


export const paidInvoiceImg = paid;
export const unpaidInvoiceImg = unpaid;
export const expensesInvoiceImg = expenses;
export const syncInvoiceImg = sync;


export const menuItems = [
    { label: 'Guest Logs', icon: FileText, path: '/home' , roles: ["SUPER_ADMIN","ADMIN", "MANAGER", "ACCOUNTS", "RECEPTIONIST"]},
    { label: 'Room Reservation', icon: BedDouble, path: '/room-reservation', roles: ["SUPER_ADMIN","ADMIN", "MANAGER", "ACCOUNTS", "RECEPTIONIST"]},
    { label: 'Hall Reservation', icon: CalendarDays, path: '/hall-reservation' , roles: ["SUPER_ADMIN","ADMIN", "MANAGER", "ACCOUNTS", "RECEPTIONIST"]},
    { label: 'Rooms', icon: Building2, path: '/rooms', roles: ["SUPER_ADMIN"] },
    { label: 'Room Service', icon: ClipboardList, path: '/room-service' , roles: ["SUPER_ADMIN"]},
    { label: 'Inventory', icon: ClipboardList, path: '/inventory' , roles: ["SUPER_ADMIN","ADMIN", "MANAGER", "ACCOUNTS"]},
    { label: 'Restaurant & Bar', icon: Utensils, path: '/restaurant-bar', roles: ["SUPER_ADMIN","ADMIN", "MANAGER", "ACCOUNTS"] },
    { label: 'House Keeping', icon: Sparkles, path: '/house-keeping', roles: ["SUPER_ADMIN","ADMIN", "MANAGER", "ACCOUNTS"] },
    { label: 'Invoice', icon: FileText, path: '/invoice', roles: ["SUPER_ADMIN","ADMIN", "MANAGER", "ACCOUNTS"] },
    // { label: 'Refund', icon: RotateCcw, path: '/refund' },
    { label: 'Discount', icon: Percent, path: '/discount' , roles: ["SUPER_ADMIN"]},
    { label: 'Settings', icon: Settings, path: '/settings', roles: ["SUPER_ADMIN"] },
    { label: 'Users', icon: Users, path: '/users', roles: ["SUPER_ADMIN"] },
];

export const ID_TYPES = ['DRIVER_LICENSE', 'PASSPORT', 'NIN', 'VOTER_CARD'];

export const PAYMENT_METHODS = ['CARD', 'CASH', 'TRANSFER'];

export const HALL_TYPES = ["CONFERENCE_ROOM", "MEETING_ROOM", "MEETING_HALL"];
export const HALL_STATUS = ["ACTIVE", "COMPLETE", "CANCELED", "UPCOMING"];
export const PAYMENT_STATUS = ["PAID", "UNPAID", "DEBIT", "REFUNDED"];

export const ROOM_TYPES = ["EXECUTIVE_SUITE", "BUSINESS_SUITE_A", "BUSINESS_SUITE_B", "EXECUTIVE_DELUXE", "DELUXE", "CLASSIC"];
export const ROOM_STATUS = ["AVAILABLE", "OCCUPIED"];

export const USER = JSON.parse(localStorage.getItem('user'));
export const USER_NAME = USER ? USER.username : null;

export const loadRoomsData = async (setLoading, setRoomOptions, navigate, endpoint = '/room/all') => {
    setLoading(true);
    try {
        const res = await restClient.get(endpoint,navigate);
        // console.log(res)
        if(res.data && res.responseHeader.responseCode === "00") {
            const data = res.data
            setRoomOptions(data.map(room => room.roomNumber))
        }
    }
    catch (error) {
        console.log(error);
    }
    finally {
        setLoading(false);
    }
}

export const roomList = async (navigate,endpoint = '/room/status?roomStatus=AVAILABLE') => {
    try {
        const res = await restClient.get(endpoint,navigate);
        // console.log(res)
        // console.log("API Response", res);
        if(res.data && res.responseHeader.responseCode === "00") {
            return res.data;
        }
    }
        // eslint-disable-next-line no-unused-vars
    catch (error) {
        return  null;
    }
}

export const fetchRoomsData = async (setModalMessage, setShowMissingFields,setRoomTypes, setAvailableRooms,navigate) => {
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


export const getData = async (endpoint,navigate) => {
    try {
        const res = await restClient.get(endpoint,navigate);
        // console.log(res)
        if(res.responseHeader.responseCode === "00") {
            return res.data;
        }
    }
        // eslint-disable-next-line no-unused-vars
    catch (error) {
        return  null;
    }
}

export const postData = async (endpoint,data,navigate) => {
    try {
        const res = await restClient.post(endpoint,data,navigate);
        // console.log(res)
        if(res.data && res.responseHeader.responseCode === "00") {
            return res.data;
        }
    }
        // eslint-disable-next-line no-unused-vars
    catch (error) {
        return  null;
    }
}