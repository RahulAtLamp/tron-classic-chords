import React, { useEffect, useState } from 'react';
import "./all-stream.scss";
import { Artists } from '../explore/artist-dummy';
import { Link } from 'react-router-dom';
import Livepeer from "livepeer-nodejs";
import ReactPlayer from 'react-player';

function AllStream() {
    const livepeerObject = new Livepeer("d72d5808-9b46-4bdf-9cb6-d703ca3e0acc");
    const [Streams, setStreams] = useState([]);

    const getStreams = async () => {
        const streams = await livepeerObject.Stream.getAll(1, true, true);
        setStreams(streams)
    };

    useEffect(() => {
        getStreams();
    }, [])


    return (
        <div className="exp">
            <div className="exp-header">All Live Streams</div>
            <div className="exp-main">
                {
                    Streams.map((stream, i) => (
                        // <a key={i} href={`https://lvpr.tv/?v=` + stream.playbackId} target="_blank">
                        <div className="exp-pa">
                            <div className="exp-bg">
                                <div className="exp-img">
                                    {/* <img src="https://picsum.photos/200" alt="" /> */}
                                    <ReactPlayer
                                        url={
                                            "https://livepeercdn.com/hls/" +
                                            stream.playbackId +
                                            "/index.m3u8"
                                        }
                                        controls={true}
                                        style={{ width: "100%"}}
                                    />
                                </div>
                                {/* <div className="exp-name" title={artist.name}>{artist.name}</div>
                                    <p className="exp-description">{artist.description}</p> */}
                            </div>
                        </div>
                        // </a>
                    ))
                }
            </div>
            <br />
        </div>
    )
}

export default AllStream;