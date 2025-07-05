
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
    RotateCcw, Settings,
    Sparkles, Users,
    Utensils
} from "lucide-react";


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
    { label: 'Guest Logs', icon: FileText, path: '/' },
    { label: 'Room Reservation', icon: BedDouble, path: '/room-reservation' },
    { label: 'Hall Reservation', icon: CalendarDays, path: '/hall-reservation' },
    { label: 'Rooms', icon: Building2, path: '/rooms' },
    { label: 'Room Service', icon: ClipboardList, path: '/room-service' },
    { label: 'Inventory', icon: ClipboardList, path: '/inventory' },
    { label: 'Restaurant & Bar', icon: Utensils, path: '/restaurant-bar' },
    { label: 'House Keeping', icon: Sparkles, path: '/house-keeping' },
    { label: 'Invoice', icon: FileText, path: '/invoice' },
    // { label: 'Refund', icon: RotateCcw, path: '/refund' },
    { label: 'Discount', icon: Percent, path: '/discount' },
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Users', icon: Users, path: '/users' },
];