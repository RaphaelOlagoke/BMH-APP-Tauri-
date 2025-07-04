import React from 'react'
import {ArrowLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center pt-5 ps-5 space-x-2 mb-4 cursor-pointer" onClick={() => navigate(-1)}>
            <ArrowLeft className="text-gray-700" />
            <span className="text-sm text-gray-700">Back</span>
        </div>
    )
}
export default BackButton
