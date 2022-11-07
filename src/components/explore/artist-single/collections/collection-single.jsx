import React from 'react';
import "./collections.scss";
import { Collections } from '../collection_dummy';

function CollectionSingle() {
    const collection = Collections[0];
    return (
        <div className='collection-main'>
            <h2 className="collection-name">{collection.name}</h2>
            <div className="collection-detail-holder">
                <div className="collection-image-holder">
                    <img className='collection-image' src={collection.image} alt={collection.image} />
                </div>
                <div className="collection-details">
                    <p className="collection-descripton">
                        {collection.description}
                    </p>
                    <p className="collection-price">
                        {collection.price}
                    </p>
                    <p className="total-minted">
                        {collection.total_minted}
                    </p>
                    <p className="remaining">
                        {collection.remaining}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CollectionSingle