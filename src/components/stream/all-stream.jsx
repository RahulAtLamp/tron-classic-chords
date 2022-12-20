import React, { useEffect, useState } from 'react';
import "./all-stream.scss";
import { Artists } from '../explore/artist-dummy';
import { Link } from 'react-router-dom';
import Livepeer from "livepeer-nodejs";
import ReactPlayer from 'react-player';
import user from "../../contract/artifacts/userStream.json"
import { ethers } from "ethers";
import Loading3 from '../../loading3';

const user_address = "0xb14bd4448Db2fe9b4DBb1D7b8097D28cA57A8DE9";

function AllStream() {
  const livepeerObject = new Livepeer("88cf2aad-9fb8-4260-8189-f223b226e5b2");
  const [Streams, setStreams] = useState([]);
  const [recordedStreams, setRecordedStreams] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStreams = async () => {
    setLoading(true);
    const streams = await livepeerObject.Stream.getAll(1, true, true);
    const contract = await getContract();
    // console.log(streams[0].playbackId);
    for (let i = 0; i < streams.length; i++) {
      console.log(await contract.streamCodeToStream(streams[i].playbackId));
    }
    setStreams(streams)
    const allRecordedStreams = await livepeerObject.Session.getAll(true);
    console.log(allRecordedStreams);
    const contract1 = await getContract();
    // for (let i = 0; i < allRecordedStreams.length; i++) {
    //   console.log(await contract1.streamCodeToStream(allRecordedStreams[i].playbackId));
    // }
    setRecordedStreams(allRecordedStreams);
    setLoading(false);
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
          const contract = new ethers.Contract(process.env.REACT_USER_ADDRESS, user, signer);
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
      {loading ?
        <Loading3 />
        :
        <>
          <div className="exp-header">All Live Streams</div>
          <div className="exp-main">
            {Streams.length > 0
              ?
              Streams.map((stream, i) => (
                <a key={i} href={`https://lvpr.tv/?v=` + stream.playbackId} target="_blank">
                  <div className="exp-pa">
                    <div className="exp-bg stream">
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
              :
              <h3 className='artist-streams'>No live streams available</h3>
            }
          </div>
          <br />

          <div className="exp-header">All Recorded Live Streams</div>
          <div className="exp-main">
            {recordedStreams.length > 0
              ?
              recordedStreams.map((stream, i) => (
                <div>
                {/* <a key={i} href={`https://livepeercdn.studio/recordings/` + stream.id + "/index.m3u8"} target="_blank"> */}
                  <div className="exp-pa">
                    <div className="exp-bg stream">
                      <div className="exp-img">
                        {/* <img src="https://picsum.photos/200" alt="" /> */}
                        <ReactPlayer
                          className="exp-nft"
                          url={
                            "https://livepeercdn.studio/recordings/" +
                            stream.id +
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
                {/* </a> */}
                </div>
              ))
              :
              <h3 className='artist-streams'>No live streams available</h3>
            }
          </div>
        </>
      }
    </div>
  )
}

export default AllStream;