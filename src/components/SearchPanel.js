import React, { useState } from "react";

function SearchPanel({ onSearch }) {
    const [query, setQuery] = useState('');
    const [userLocation, setUserLocation] = useState('');
    const [radius, setRadius] = useState('50');

    function handleSubmit(e) {
        e.preventDefault();
        onSearch(query, userLocation, radius);
    }

    return (
        <div>
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    className="search-input"
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="e.g. reliable Honda under $10k with low miles"
                />
                <input
                    className="location-input"
                    type="text"
                    value={userLocation}
                    onChange={e => setUserLocation(e.target.value)}
                    placeholder="Zip or City, State"
                />
                <select className="radius-select" value={radius} onChange={e => setRadius(e.target.value)}>
                    <option value="25">25 miles</option>
                    <option value="50">50 miles</option>
                    <option value="100">100 miles</option>
                    <option value="200">200 miles</option>
                </select>
                <button className="search-button" type="submit">Search</button>
            </form>
        </div>
    );
}

export default SearchPanel;