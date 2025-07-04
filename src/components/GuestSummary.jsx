import React from 'react'

const GuestSummary = ({guest, totalPaid, balance}) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <p><strong>Name:</strong> {guest.name}</p>
            <p><strong>Phone:</strong> {guest.phone}</p>
            <p><strong>ID Type:</strong> {guest.idType}</p>
            <p><strong>ID Ref:</strong> {guest.idRef}</p>
            <p><strong>Total Paid:</strong> ₦{totalPaid.toLocaleString()}</p>
            <p><strong>Outstanding:</strong> ₦{balance.toLocaleString()}</p>
        </div>

    )
}
export default GuestSummary
