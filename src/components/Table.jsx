import React from 'react'
import Searchbar from "./Searchbar.jsx";
import DateFilter from "./DateFilter.jsx";
import { Pencil } from 'lucide-react';


const Table = ({
filterForm,
columns,
onEdit,
showEdit = false,
currentPage,
totalPages,
onPageChange,
data
}) =>
{
    return (
        <div className="bg-white px-6 py-12 shadow-lg rounded-2xl me-5">
            {filterForm && <div className="mb-4">{filterForm}</div>}

            {/* Table */}
            <div className="overflow-x-auto mt-6">
                <table className="min-w-full text-sm text-left border">
                    <thead className="bg-gray-100 border-b">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.accessor} className="px-4 py-2 font-medium text-gray-700">
                                {col.label}
                            </th>
                        ))}
                        {showEdit && <th className="px-4 py-2 font-medium text-gray-700">Edit</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (showEdit ? 1 : 0)} className="px-4 py-4 text-center text-gray-500">
                                No data found.
                            </td>
                        </tr>
                    ) : (
                        data.map((row, idx) => (
                            <tr key={idx} className="border-t hover:bg-gray-50">
                                {columns.map((col) => (
                                    <td key={col.accessor} className="px-4 py-2">
                                        {col.render
                                            ? col.render(row[col.accessor])
                                            : row[col.accessor]}
                                    </td>
                                ))}
                                {showEdit && (
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => onEdit?.(row)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end items-center gap-2 mt-4">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

        </div>
    )
}
export default Table
