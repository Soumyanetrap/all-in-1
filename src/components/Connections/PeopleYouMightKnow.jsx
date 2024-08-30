// PeopleYouMightKnow.jsx
import React from 'react';

const PeopleYouMightKnow = ({ suggestions, loading }) => (
    <div className="box">
        <h3>People You Might Know</h3>
        {loading ? (
            <p>Loading...</p>
        ) : (
            <ul>
                {suggestions.length > 0 ? (
                    suggestions.map((suggestion) => (
                        <li key={suggestion.id}>
                            <span>{suggestion.name}</span>
                        </li>
                    ))
                ) : (
                    <p>Too Early for Suggestions.</p>
                )}
            </ul>
        )}
    </div>
);

export default PeopleYouMightKnow;
