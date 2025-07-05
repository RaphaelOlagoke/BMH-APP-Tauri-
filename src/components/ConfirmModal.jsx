import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
                <p className="text-gray-700 text-xl">{message}</p>
                <div className="mt-4 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded"
                        >
                            Confirm
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
