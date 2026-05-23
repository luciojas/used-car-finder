import React from "react";

function CarCard({car}){
    const photo = car.media?.photo_links?.[0];
    const {year, make, model, trim, highway_mpg}=car.build;

    return(
        <div style={{border: '1px solid #ccc', borderRadius: 8, padding: 16, display: 'flex', gap: 16}}>
            {photo && <img src={photo} alt={car.heading} style={{width: 180, objectFit: 'cover', borderRadius: 6}}/>}
            <div>
                <h2 style={{margin: '0 0 8px'}}>{car.heading}</h2>
                <p>Value Score: <strong>{car.score}/100</strong></p>
                <p><strong>{car.price ? `$${car.price.toLocaleString()}` : 'Price not listed'}</strong></p>
                <p>{car.miles ? `${car.miles.toLocaleString()} miles` : 'Mileage not listed'}</p>
                <p>{car.dealer.city}, {car.dealer.state}</p>
                <a href={car.vdp_url} target="_blank" rel="noreferrer">View Listing →</a>
            </div>
        </div>
    );
}

export default CarCard;