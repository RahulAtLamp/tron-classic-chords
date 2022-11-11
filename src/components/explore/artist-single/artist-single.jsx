import React, { useEffect, useState } from 'react';
import "./artist-single.scss";
import { Link } from 'react-router-dom';
import { Artists } from '../artist-dummy';
import { Collections } from './collection_dummy';
import { getRoles } from '@testing-library/react';

function ArtistSingle() {
  const singleArtist = Artists[10];
  console.log(singleArtist);
  const [showPopup, setShowPopup] = useState(false);

  // useEffect(()=>{

  // },[])

  return (
    <div className='artist-main'>
      <div className='artist-card-holder'>
        <div className='artist-card'>
          {/* <div className='artist-color-holder'>
            <div className='artist-color-circle'></div>
          </div> */}
          <div className="artist-detail">
            <h1 className="artist-name">{singleArtist.name}</h1>
            <p className="artist-description">{singleArtist.description.toLocaleUpperCase()}</p>
            <p className="artist-instrument">{singleArtist.instrument.toLocaleUpperCase()}</p>
          </div>
          <div className="artist-image-container">
            <img className='artist-image' alt="artist image" src={singleArtist.image} />
          </div>
        </div>
      </div>
      <div className="artist-creations">
        <h2 className="artist-creations-header">
          Creations
        </h2>
        <div className="artist-creations-list-container">
          <div className="artist-creations-list">
            {
              Collections.map((collection, i) => (
                <Link key={i} to="/artist/1/collections/1">
                  <div className="artist-collection-pa">
                    <div className="exp-bg">
                      <div className="exp-img">
                        <img className="exp-nft" src={collection.image} />
                      </div>
                      <div className="exp-name" title={collection.name}>{collection.name}</div>
                      <p className="exp-description">{collection.description}</p>
                      <div className="buy-button-holder">
                        <button className="buy-button" onClick={(e) => { e.preventDefault(); }}> <span className='buy-button-tag'>BUY</span> &nbsp; <img src="/images/tl.svg" width="15px" height="15px" /><span>{collection.price}</span></button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
      {/* <div className="buy-nft-container">
        <div className="buy-nft">

        </div>
      </div> */}
    </div>
  )
}

export default ArtistSingle