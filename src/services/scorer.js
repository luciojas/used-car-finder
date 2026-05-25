const RELIABILITY = {
    Toyota: 95, Honda: 92, Mazda: 90, Subaru: 85, Hyundai: 80,
    Kia: 78, Chevrolet: 72, Ford: 70, Nissan: 68, Jeep: 55
};

function scoreListings(listings) {
    if(!listings.length) return [];

    const valid = listings.filter(c => c.price && c.miles);

    if (!valid.length) return [];

    const prices = valid.map(c => c.price);
    const miles = valid.map(c => c.miles);
    const minPrice = Math.min(...prices), maxPrice = Math.max(...prices);
    const minMiles = Math.min(...miles), maxMiles = Math.max(...miles);

    return valid.map(car => {
        const priceScore = maxPrice === minPrice ? 100 
        : ((maxPrice - car.price) / (maxPrice-minPrice)) *100;

        const milesScore = maxMiles === minMiles ? 100
        : ((maxMiles - car.miles) / (maxMiles - minMiles)) * 100;

        const reliabilityScore = RELIABILITY[car.build.make] ?? 65;

        const total = (priceScore *.35) + (milesScore*.25) + (reliabilityScore*.4);

        return {...car, score: Math.round(total)};
    }).sort((a, b) => b.score - a.score);
}

export default scoreListings;