import React from 'react';
import {
    Search
} from 'lucide-react';
import Searchbar from "./Searchbar.jsx";
import {USER_NAME} from "../utils/index.js";

const Icon = Search;

const Header = () => {
    return (
        <div className="flex justify-between w-full px-4">
            <h2 className="text-xl font-semibold">{`Hello ${USER_NAME} 👋🏼,`}</h2>
            {/*<Searchbar  placeholder={placeholder} value={value} onChange={onChange} onSubmit={onSubmit} />*/}
        </div>

    );
};

export default Header;
