const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

export async function parseCarSearch(query) {
    const prompt =`You are a car search assistant.
    Parse this search into JSON with these fields:
    make, model, year_min, year_max, price_max, miles_max.
    Use null for anything not mentioned.
    Return JSON only, no explanation.
    Search: "${query}"`;

    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            contents: [{parts: [{text: prompt}]}]
        })
    })
    const data = await response.json();
    console.log('Gemini response:', data);
    console.log('gemini module loaded', parseCarSearch);
}