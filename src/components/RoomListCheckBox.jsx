import React from 'react'

const RoomListCheckBox = ({rooms, selectedRooms, toggleRoom}) => {
    return (
        <div>
            {rooms.map(room => (
                <label key={room} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={selectedRooms.includes(room)}
                        onChange={() => toggleRoom(room)}
                    />
                    <span>{room}</span>
                </label>
            ))}

        </div>
    )
}
export default RoomListCheckBox
