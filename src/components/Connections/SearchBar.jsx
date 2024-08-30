// SearchBar.jsx
import React from 'react';

const SearchBar = ({ onChange, onClick, options, showDropdown, searchInputRef }) => (
    <div id='search-container'>
        <input
            type='text'
            id='search-input'
            ref={searchInputRef}
            onChange={onChange}
            placeholder='Search people...'
        />
        {showDropdown && (
            <ul id='dropdown'>
                {options.map((option, index) => (
                    <li key={index} onClick={() => onClick(option)}>
                        {option.username}
                    </li>
                ))}
            </ul>
        )}
    </div>
);

export default SearchBar;
