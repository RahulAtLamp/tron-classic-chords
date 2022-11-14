import React, { useState } from 'react';
import "./sell-collection-single.scss";
import { Collections } from '../collection_dummy';

function SellCollectionSingle() {
    const collection = Collections[3];
    const [sellData, setSellData] = useState({ qty: null, price: null, option: null });

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
                        Total Minted
                    </p>

                    <p className="total-minted">
                        {collection.total_minted}
                    </p>

                    <input className='total-qty' type="number" placeholder='Quantity to sell' onChange={(e) => { setSellData({ ...sellData, qty: e.target.value }) }} />

                    <input className='total-price' type="number" placeholder='Price' onChange={(e) => { setSellData({ ...sellData, price: e.target.value }) }} />

                    <select className='sell-options' defaultValue={""} onChange={(e) => { setSellData({ ...sellData, option: e.target.value }) }}>
                        <option value="">--select--</option>
                        <option value="rent">Rent</option>
                        <option valu="sell">Sell</option>
                    </select>

                    <button className="sell-buy-button">
                        proceed
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SellCollectionSingle