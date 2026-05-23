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
            <h2>Search for a car</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Describe the car you want..."
                    style={{ width: 400, marginRight: 8 }}
                />
                <input
                    type="text"
                    value={userLocation}
                    onChange={e => setUserLocation(e.target.value)}
                    placeholder="Zip code or City, State"
                    style={{ width: 200, marginRight: 8 }}
                />
                <select value={radius} onChange={e => setRadius(e.target.value)} style={{ marginRight: 8 }}>
                    <option value="25">25 miles</option>
                    <option value="50">50 miles</option>
                    <option value="100">100 miles</option>
                    <option value="200">200 miles</option>
                </select>
                <button type="submit">Search</button>
            </form>

        </div>
    );
}

export default SearchPanel;