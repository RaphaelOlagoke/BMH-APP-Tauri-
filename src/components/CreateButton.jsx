import React from 'react';
import { Plus } from 'lucide-react';

const CreateButton = ({ onClick, label = "Create" }) => (
    <button
        onClick={onClick}
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
    >
        <Plus size={18} className="mr-2" />
        {label}
    </button>
);

export default CreateButton;
