import React from 'react';
import "./collection-single.scss";
import { Collections } from '../collection_dummy';

function CollectionSingle() {
    const collection = Collections[3];
    return (
        <div className='collection-main'>
            <h2 className="collection-name">{collection.name}</h2>
            <div className="collection-detail-holder">
                <div className="collection-image-holder">
                    <img className='collection-image' src={collection.image} alt={collection.image} />
                </div>
                <div className="collection-sub">
                    <p className="collection-description">
                        {collection.description}
                    </p>
                    <p className="total-minted">
                        Total Minted / Remaining
                    </p>
                    <p className="total-minted">
                        {collection.total_minted}/{collection.remaining}
                    </p>
                    <button className="collection-buy-button">
                        <span className='buy-button-tag'>BUY</span> &nbsp; <img src="/images/tl.svg" width="15px" height="15px" /><span>{collection.price}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CollectionSingle