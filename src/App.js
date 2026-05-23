import React, { useState } from "react";
import SearchPanel from "./components/SearchPanel";
import CarCard from "./components/CarCard";
import scoreListings from './services/scorer';
import AdviceBox from './components/AdviceBox';


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

    filters.location = userLocation;
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

    const scrapeRes = await fetch('http://localhost:5000/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters)
    });
    const scrapeData = await scrapeRes.json();
    console.log('Carfax listings:', scrapeData);
  }



  return (
    <div>
      <h1>Used Car Finder</h1>
      <SearchPanel onSearch={handleSearch} />
      {loading && <p>Searching...</p>}
      <AdviceBox advice={advice} />
      <div className="results">
        {listings.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}

export default App;