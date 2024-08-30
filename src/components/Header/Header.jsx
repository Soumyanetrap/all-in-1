import React from 'react';
import './Header.css'
const Header = ({ username }) => (
    <header className="header">
        <h2>Welcome {username}</h2>
    </header>
);

export default Header;