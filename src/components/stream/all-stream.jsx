import React, { useEffect, useState } from 'react';
import "./all-stream.scss";
import { Artists } from '../explore/artist-dummy';
import { Link } from 'react-router-dom';
import Livepeer from "livepeer-nodejs";
import ReactPlayer from 'react-player';
import user from "../../contract/artifacts/userStream.json"
import { ethers } from "ethers";
const user_address = "0x036E73d74e86cC50930d78f26cf97d603c40088f";


function AllStream() {
    const livepeerObject = new Livepeer("f3edde15-46b8-453f-9f7f-f19f51f3863e");
    const [Streams, setStreams] = useState([]);

    const getStreams = async () => {
        const streams = await livepeerObject.Stream.getAll(1, true, true);
        const contract = await getContract();
        console.log(streams[0].playbackId);
        for(let i=0;i<streams.length;i++){
          console.log(await contract.stramCodeToSteam(streams[i].playbackId)); 
        }
        setStreams(streams)
    };

    const getContract = async () => {
        try {
          const { ethereum } = window;
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            if (!provider) {
              console.log("Metamask is not installed, please install!");
            }
            const { chainId } = await provider.getNetwork();
            console.log("switch case for this case is: " + chainId);
            if (chainId === 1029) {
              const contract = new ethers.Contract(user_address, user, signer);
              return contract
            } else {
              alert("Please connect to the bitTorent Network!");
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    
    useEffect(() => {
        getStreams();
    }, [])


    return (
        <div className="exp">
            <div className="exp-header">All Live Streams</div>
            <div className="exp-main">
                {
                    Streams.map((stream, i) => (
                        <a key={i} href={`https://lvpr.tv/?v=` + stream.playbackId} target="_blank">
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
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    {/* <div className="exp-name" title={artist.name}>{artist.name}</div>
                                    <p className="exp-description">{artist.description}</p> */}
                                </div>
                            </div>
                        </a>
                    ))
                }
            </div>
            <br />
        </div>
    )
}

export default AllStream;