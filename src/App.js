import React, { useState } from "react";
import SearchPanel from "./components/SearchPanel";

function App() {
  const[searchQuery, setSearchQuery]=useState('');

  function handleSearch(query){
    setSearchQuery(query);
  }

  return (
    <div>
      <h1>Used Car Finder</h1>
      <SearchPanel onSearch={handleSearch}/>
      {searchQuery && <p>Searching for: {searchQuery}</p>}
    </div>
  );
}

export default App;
