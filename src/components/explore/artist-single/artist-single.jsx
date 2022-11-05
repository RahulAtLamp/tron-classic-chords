import React from 'react';
import "./artist-single.scss";
import { Artists } from '../artist-dummy';

function ArtistSingle() {
  const singleArtist = Artists[0];
  console.log(singleArtist);

  return (
    <div className='artist-main'>
      <div className='artist-card-holder'>
        <div className='artist-card'>
          <div className="artist-detail">
            <p className="artist-name">{singleArtist.name}</p>
            <p className="artist-description">{singleArtist.description}</p>
            <p className="artist-instrument">{singleArtist.instrument}</p>
          </div>
          <div className="artist-image-container">
            <img className='artist-image' alt="artist image" src={singleArtist.image} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtistSingle