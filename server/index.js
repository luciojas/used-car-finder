require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const puppeteer = require('puppeteer');


const app = express();
app.use(cors());
app.use(express.json());

const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const API_KEY = process.env.AZURE_OPENAI_KEY;
const DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;
const API_VERSION = '2024-12-01-preview';

console.log('ENDPOINT:', ENDPOINT);
console.log('DEPLOYMENT:', DEPLOYMENT);

app.post('/api/search', async (req, res) => {
    const { query } = req.body;

    try {
        const response = await axios.post(
            `${ENDPOINT}openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`,
            {
                messages: [
                    {
                        role: 'system',
                        content: 'You are a car search assistant. Parse searches into JSON with fields: make, model, year_min, year_max, price_max, miles_max. Use null for anything not mentioned. Return JSON only, no explanation.'
                    },
                    {
                        role: 'user',
                        content: query
                    }
                ]
            },
            {
                headers: {
                    'api-key': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const text = response.data.choices[0].message.content;
        const clean = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        res.json(parsed);

    } catch (err) {
        console.error(`Azure OpenAI error:`, err.response?.data || err.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

const PORT = 5000;

async function resolveZip(location) {
    if (/^\d{5}$/.test(location.trim())) {
        return location.trim()
    }
    try {
        const encoded = encodeURIComponent(location);
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${encoded}&countrycodes=us&format=json&limit=1`,
            { headers: { 'User-Agent': 'used-car-finder-app' } }
        );
        if (response.data.length === 0) return null;
        const { lat, lon } = response.data[0];
        const reverse = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            { headers: { 'User-Agent': 'used-car-finder-app' } }
        );
        return reverse.data.address?.postcode || null;
    } catch (err) {
        console.error('Geocoding error:', err.message);
        return null;
    }
}

async function resolveCoords(location) {
    try {
        const encoded = encodeURIComponent(location);
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${encoded}&countrycodes=us&format=json&limit=1`,
            { headers: { 'User-Agent': 'used-car-finder-app' } }
        );
        if (response.data.length === 0) return null;
        return { lat: parseFloat(response.data[0].lat), lon: parseFloat(response.data[0].lon) };
    } catch (err) {
        console.error('Coords error:', err.message);
        return null;
    }
}

function distanceMiles(lat1, lon1, lat2, lon2) {
    const R = 3958.8; //earth radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

app.post('/api/listings', async (req, res) => {
    const { make, model, price_max, miles_max, year_min, year_max, userLocation, radius } = req.body;

    const params = new URLSearchParams({
        api_key: process.env.MARKETCHECK_API_KEY,
        car_type: 'used',
        rows: 50
    });

    if (make) params.append('make', make);
    if (model) params.append('model', model);
    if (price_max) params.append('price_max', price_max);
    if (miles_max) params.append('miles_max', miles_max);
    if (year_min) params.append('year_min', year_min);
    if (year_max) params.append('year_max', year_max);

    if (userLocation) {
        const zip = await resolveZip(userLocation);
        if (zip) {
            params.append('zip', zip);
            params.append('radius', radius || '50');
        }
    }

    try {
        const response = await axios.get(
            `https://mc-api.marketcheck.com/v2/search/car/active?${params}`
        );
        let listings = response.data.listings || [];

        // Filter by price and miles
        listings = listings.filter(car => {
            if (price_max && car.price > price_max) return false;
            if (miles_max && car.miles > miles_max) return false;
            return true;
        });

        // Filter by distance if location provided
        if (userLocation) {
            const coords = await resolveCoords(userLocation);
            if (coords) {
                listings = listings.filter(car => {
                    const dealerLat = parseFloat(car.dealer?.latitude);
                    const dealerLon = parseFloat(car.dealer?.longitude);
                    if (!dealerLat || !dealerLon) return true; // keep if no coords
                    const dist = distanceMiles(coords.lat, coords.lon, dealerLat, dealerLon);
                    return dist <= parseFloat(radius || 50);
                });
            }
        }

        res.json(listings);
    } catch (err) {
        console.error('MarketCheck error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});

app.post('/api/advice', async (req, res) => {
    const { make, model, price_max, miles_max, year_min, year_max } = req.body;

    const prompt = `Give buying advice for someone searching for a used ${make || ''} ${model || ''} 
    ${year_min ? `from ${year_min}` : ''} ${year_max ? `to ${year_max}` : ''} 
    ${price_max ? `under $${price_max}` : ''} ${miles_max ? `under ${miles_max} miles` : ''}.
    
    Include: best model years to target, common problems to watch for, what to inspect, and whether it's a good value. 
    Keep it concise — 4 to 6 bullet points max.`;

    try {
        const response = await axios.post(
            `${ENDPOINT}openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`,
            {
                messages: [
                    { role: 'system', content: 'You are an expert used car buying advisor. Give practical, specific advice in bullet points. No fluff.' },
                    { role: 'user', content: prompt }
                ]
            },
            { headers: { 'api-key': API_KEY, 'Content-Type': 'application/json' } }
        );
        res.json({ advice: response.data.choices[0].message.content });
    } catch (err) {
        console.error('Advice error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Could not generate advice' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});