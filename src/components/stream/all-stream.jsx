import React from 'react';
import "./all-stream.scss";
import { Artists } from '../explore/artist-dummy';
import { Link } from 'react-router-dom';
function AllStream() {
    return (
        <div className="exp">
            <div className="exp-header">All Live Streams</div>
            <div className="exp-main">
                {
                    Artists.map((artist, i) => (
                        <Link key={i} to="/all-stream/1">
                            <div className="exp-pa">
                                <div className="exp-bg">
                                    <div className="exp-img">
                                        <img className="exp-nft" src={artist.profileImage} />
                                    </div>
                                    <div className="exp-name" title={artist.name}>{artist.name}</div>
                                    <p className="exp-description">{artist.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
            <br />
        </div>
    )
}

export default AllStream;