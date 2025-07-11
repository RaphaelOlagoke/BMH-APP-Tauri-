import React from 'react'

const GuestSummary = ({guest, totalPaid, balance, totalAmountDue}) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <p><strong>Name:</strong> {guest.guestName}</p>
            <p><strong>Phone:</strong> {guest.phoneNumber}</p>
            <p><strong>ID Type:</strong> {guest.idType}</p>
            <p><strong>ID Ref:</strong> {guest.idRef}</p>
            <p><strong>Total Paid:</strong> ₦{totalPaid.toLocaleString()}</p>
            <p><strong>Credit Amount:</strong> ₦{balance.toLocaleString()}</p>
            <p><strong>Outstanding:</strong> ₦{totalAmountDue.toLocaleString()}</p>
        </div>

    )
}
export default GuestSummary
