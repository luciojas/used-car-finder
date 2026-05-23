# Used Car Finder
An AI-powered used car search app that ranks listings by value — not just price.

## What it does
- You describe what you want in plain English ("reliable SUV under 25k with low miles")
- Azure OpenAI parses your search into structured filters
- Pulls live listings from MarketCheck API
- Scores each listing by price, mileage, and reliability and ranks them best-to-worst value

## Built with
- React (frontend)
- Node.js + Express (backend)
- Azure OpenAI gpt-4.1-mini (natural language parsing)
- MarketCheck API (live car listings)

## How to run
1. Clone this repo
2. In `smart-car-finder/` run `npm install` then `npm start` (frontend on port 3000)
3. In `server/` run `npm install` then `node index.js` (backend on port 5000)
4. Add your API keys to `server/.env`: