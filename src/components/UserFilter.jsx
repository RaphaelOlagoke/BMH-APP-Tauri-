import React from 'react'

const UserFilter = ({
    headerText,
    isActive,
    setIsActive,
    userAccess,
    setUserAccess,
    userRole,
    setUserRole,
    onSubmit,
    userAccessOptions,
    userRoleOptions
}) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl">{headerText}</h2>
                <div className="flex items-center space-x-5 justify-end">

                    {/* User Access Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">User Access</p>
                        <select
                            value={userAccess}
                            onChange={(e) => setUserAccess(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="">All</option>
                            {userAccessOptions.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* User Role Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">User Role</p>
                        <select
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="">All</option>
                            {userRoleOptions.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Is Active Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm">Is Active</p>
                        <select
                            value={isActive}
                            onChange={(e) => setIsActive(e.target.value)}
                            className="border border-blue-300 rounded px-5 py-2  text-sm"
                        >
                            <option value="">All</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 mt-5 rounded hover:bg-blue-700 transition text-sm"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    )
}

export default UserFilter
