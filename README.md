# Used Car Finder
An AI-powered used car search app that ranks listings by value — not just price.

## What it does
- Describe what you want in plain English ("reliable Honda under $10k near San Antonio")
- Azure OpenAI parses your search into structured filters
- Pulls live listings from MarketCheck API
- Scores each listing by price, mileage, and reliability
- AI buying advice tailored to your specific search
- Location filtering by zip code or city/state with radius selection

## Built with
- React (frontend)
- Node.js + Express (backend)
- Azure OpenAI gpt-4.1-mini (natural language parsing + buying advice)
- MarketCheck API (live car listings)
- OpenStreetMap Nominatim (free geocoding)

## How to run
1. Clone this repo
2. In `smart-car-finder/` run `npm install` then `npm start` (frontend on port 3000)
3. In `smart-car-finder/server/` run `npm install` then `node index.js` (backend on port 5000)
4. Add your API keys to `smart-car-finder/server/.env`:

## Note
- AZURE_OPENAI_KEY=your_key
- AZURE_OPENAI_ENDPOINT=your_endpoint
- AZURE_OPENAI_DEPLOYMENT=gpt-4.1-mini
- MARKETCHECK_API_KEY=your_key

## Status
- Complete