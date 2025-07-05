import React from 'react'

const InfoMenu = ({menuItems}) => {
    return (
        <div className="bg-white px-6 py-12 shadow-lg rounded-2xl me-5 my-5">
            <div className="flex space-x-20">
                {menuItems.map(({ label, image, count , formattedValue}, index) => (
                    <div className="flex space-x-3" key={index}>
                        <img className="w-14 h-14" src={image} alt="logo" />
                        <div>
                            <p className="text-xs">{label}</p>
                            <h2 className="text-2xl font-bold">{count}</h2>
                            <p className="text-xs">{formattedValue}</p>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}
export default InfoMenu
