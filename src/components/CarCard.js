import React from "react";

function CarCard({ car }) {
    const photo = car.media?.photo_links?.[0];
    const scoreClass = car.score >= 75 ? 'score-high' : car.score >= 50 ? 'score-mid' : 'score-low';

    return (
        <div className="car-card">
            {photo && <img src={photo} alt={car.heading} />}
            <div className="car-card-body">
                <h2>{car.heading}</h2>
                <span className={`score-badge ${scoreClass}`}>⭐ {car.score}/100 Value Score</span>
                <p className="car-price">{car.price ? `$${car.price.toLocaleString()}` : 'Price not listed'}</p>
                <p className="car-meta">{car.miles ? `${car.miles.toLocaleString()} miles` : 'Mileage not listed'}</p>
                <p className="car-meta">📍 {car.dealer.city}, {car.dealer.state}</p>
                <a className="view-link" href={car.vdp_url} target="_blank" rel="noreferrer">View Listing →</a>
            </div>
        </div>
    );
}

export default CarCard;