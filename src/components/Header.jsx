import React from 'react';
import {
    Search
} from 'lucide-react';
import Searchbar from "./Searchbar.jsx";

const Icon = Search;

const Header = ({ headerText, placeholder = 'Search...', value, onChange }) => {
    return (
        <div className="flex justify-between w-full px-4">
            <h2 className="text-xl font-semibold">{headerText}</h2>
            <Searchbar  placeholder={placeholder} value={value} onChange={onChange} />
        </div>

    );
};

export default Header;
