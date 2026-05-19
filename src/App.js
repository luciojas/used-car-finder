import React, { useState } from "react";
import SearchPanel from "./components/SearchPanel";
import * as gemini from './services/gemini'
function App() {
  const[searchQuery, setSearchQuery]=useState('');

  async function handleSearch(query){
    setSearchQuery(query);
    await gemini.parseCarSearch(query);
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
