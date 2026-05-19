import React, {useState} from "react";

function SearchPanel({onSearch}){
    const [searchQuery, setSearchQuery] = useState('');

    return(
        <div>
            <h2>Search for a car</h2>
            <input
                type="text"
                placeholder="Describe the car you want..."
                value={searchQuery}
                onChange={(e)=> setSearchQuery(e.target.value)}
            />
            <button onClick={()=> onSearch(searchQuery)}>
                Search
            </button>
        </div>
    );
}

export default SearchPanel;