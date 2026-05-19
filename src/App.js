import React, {useState} from "react";

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <h1>Used Car Finder</h1>
      <input
        type="text"
        placeholder="Describe the car you want..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
      <p>You typed: {searchQuery}</p>
      <button onClick={() => alert('Searching for: '+ searchQuery)}>
        Search
      </button>
    </div>
  );
}

export default App;
