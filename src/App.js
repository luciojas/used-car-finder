import React, { useState } from "react";
import SearchPanel from "./components/SearchPanel";
import CarCard from "./components/CarCard";
import scoreListings from './services/scorer';
import AdviceBox from './components/AdviceBox';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState('');

  async function handleSearch(query, userLocation, radius) {
    setSearchQuery(query);
    setLoading(true);
    setListings([]);
    setAdvice('');

    //parses the query into filters
    const filterRes = await fetch('http://localhost:5000/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const filters = await filterRes.json();

    filters.userLocation = userLocation;
    filters.radius = radius;

    //fetch the listings using filters
    const listingRes = await fetch('http://localhost:5000/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters)
    });

    const data = await listingRes.json();
    setListings(scoreListings(data));

    const adviceRes = await fetch('http://localhost:5000/api/advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters)
    });
    const adviceData = await adviceRes.json();
    setAdvice(adviceData.advice);
    setLoading(false);
  }

  return (
    <div>
      <div className="app-header">
        <h1>🚗 Used Car Finder</h1>
        <SearchPanel onSearch={handleSearch} />
      </div>
      <div className="main-content">
        {loading && <p className="loading">Finding the best deals...</p>}
        <AdviceBox advice={advice} />
        <div className="results-grid">
          {listings.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;