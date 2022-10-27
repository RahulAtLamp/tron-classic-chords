import React from "react";
import { useEffect, useRef, useState } from "react";
import { Client } from "@livepeer/webrtmp-sdk";
import Livepeer from "livepeer-nodejs";
import { create, CID } from "ipfs-http-client";
import "./stream.scss";

function Streaming({ account, contract }) {
  const videoEl = useRef(null);
  const stream = useRef(null);
  const [session, setSession] = useState("");
  const [url, setUrl] = useState("");
  const livepeerObject = new Livepeer("d72d5808-9b46-4bdf-9cb6-d703ca3e0acc");
  const client = create("https://ipfs.infura.io:5001/api/v0");
  const getStreams = async () => {
    const streams = await livepeerObject.Stream.get(
      "00bf97a4-5264-4505-9fe5-469ca7686e53"
    );
    console.log(streams);
  };

  //
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [add, setAdd] = useState("");
  const [record, setRecord] = useState("");

  useEffect(() => {
    (async () => {
      videoEl.current.volume = 0;

      stream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoEl.current.srcObject = stream.current;
      videoEl.current.play();
    })();
  });
  const [heroImage, setHeroImage] = useState();
  const [uploaded_image, setUploadedImage] = useState();
  async function UploadImage(e) {
    const file = e.target.files[0];
    console.log(file);
    setHeroImage(file);
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setUploadedImage(url);
      console.log(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  const onButtonClick = async () => {
    const stream_ = await livepeerObject.Stream.create({
      name: "test_stream",
      profiles: [
        {
          name: "720p",
          bitrate: 2000000,
          fps: 30,
          width: 1280,
          height: 720,
        },
        {
          name: "480p",
          bitrate: 1000000,
          fps: 30,
          width: 854,
          height: 480,
        },
        {
          name: "360p",
          bitrate: 500000,
          fps: 30,
          width: 640,
          height: 360,
        },
      ],
    });
    console.log(stream_);
    console.log(stream_.streamKey);
    stream_.setRecord(true);
    const current_stream = await livepeerObject.Stream.get(stream_.id);
    console.log("video id" + stream_.id);
    const result = await current_stream.setRecord(true);
    console.log(result);
    const url =
      "https://livepeercdn.com/hls/" + stream_.playbackId + "index.m3u8";
    setUrl(url);
    const streamKey = stream_.streamKey;

    if (!stream.current) {
      alert("Video stream was not started.");
    }

    if (!streamKey) {
      alert("Invalid streamKey.");
      return;
    }

    const client = new Client();

    const session = client.cast(stream.current, streamKey);

    session.on("open", () => {
      console.log("Stream started.");
      alert("Stream started; visit Livepeer Dashboard.");
    });

    session.on("close", () => {
      console.log("Stream stopped.");
    });

    session.on("error", (err) => {
      console.log("Stream error.", err.message);
    });

    const tx = await contract.createStream(
      account,
      title,
      des,
      "0xfe039eb325231e046f06f828c41382ac59f73e45",
      uploaded_image,
      stream_.id,
      record
    );
    tx.wait();
    // console.log(title);
    // console.log(des);
    // console.log(add);
    // console.log(record);
  };

  const closeStream = async () => {
    session.close();
  };
  const hero_Image = useRef(null);
  return (
    <>
      <section className="cs">
        {/* <input
          className="cs-input"
          ref={inputEl}
          type="text"
          placeholder="streamKey"
        /> */}
        <div className="cs-left-container">
          <video className="cs-video" ref={videoEl} controls />
          <div className="cs-btns">
            <button className="cs-button" onClick={onButtonClick}>
              Start
            </button>
            <button className="cs-button" onClick={closeStream}>
              Stop
            </button>
          </div>
        </div>
        <div className="cs-right-container">
          <form>
            <formfield className="cs-formfield">
              <input
                className="cs-input"
                type="text"
                placeholder="Stream Title"
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </formfield>
            <formfield className="cs-formfield">
              <textarea
                className="cs-textarea"
                type="text"
                placeholder="Stream Description"
                rows="6"
                cols="50"
                onChange={(event) => setDes(event.target.value)}
              />
            </formfield>
            <formfield className="cs-formfield">
              <input
                className="cs-input"
                type="text"
                placeholder="Enter Wallet Address"
                onChange={(event) => setAdd(event.target.value)}
                required
              />
            </formfield>

            <formfield className="cs-formfield">
              <div className="cs-label">
                {" "}
                <p>Choose cover image for stream</p>
                {heroImage ? (
                  <>
                    <img
                      className="cs-uploaded-image"
                      src={uploaded_image}
                      alt=""
                    />
                  </>
                ) : (
                  <div
                    className="space-to-upload-image"
                    onClick={(e) => {
                      hero_Image.current.click();
                    }}
                  >
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1000 1000"
                      enable-background="new 0 0 1000 1000"
                    >
                      <metadata>
                        {" "}
                        Svg Vector Icons : http://www.onlinewebfonts.com/icon{" "}
                      </metadata>
                      <g>
                        <path d="M850,974.5H150c-77.3,0-140-65.3-140-145.9V646.3c0-20.1,15.7-36.5,35-36.5h70c19.3,0,35,16.3,35,36.5v109.4c0,40.3,31.3,72.9,70,72.9h560c38.7,0,70-32.7,70-72.9V646.3c0-20.1,15.7-36.5,35-36.5h70c19.3,0,35,16.3,35,36.5v182.3C990,909.2,927.3,974.5,850,974.5L850,974.5z M784.5,449.2c-14.2,14.8-37.1,14.8-51.3,0L570,279.1v367.2c0,20.1-15.7,36.5-35,36.5h-70c-19.3,0-35-16.3-35-36.5V279.1L266.8,449.2c-14.2,14.8-37.1,14.8-51.3,0l-51.3-53.4c-14.2-14.8-14.2-38.7,0-53.4L453.2,41.1c1.2-1.3,23.7-15.6,46.4-15.6c22.9,0,45.9,14.3,47.2,15.6l289.1,301.2c14.2,14.8,14.2,38.7,0,53.4L784.5,449.2L784.5,449.2z" />
                      </g>
                    </svg>
                  </div>
                )}
                <input
                  className="cs-input"
                  type="file"
                  id="my-file"
                  name="hero-image"
                  hidden
                  ref={hero_Image}
                  onChange={(e) => {
                    UploadImage(e);
                  }}
                  required
                />
              </div>
            </formfield>
            <formfield className="cs-formfield">
              <label>Do you want to save this Stream?</label>
              <label>
                <input
                  className="cs-input-radio"
                  type="radio"
                  name="radiobutton"
                  value="true"
                  onChange={(event) => setRecord(event.target.value)}
                  checked
                ></input>
                Yes
              </label>
              <label>
                <input
                  className="cs-input-radio"
                  type="radio"
                  name="radiobutton"
                  value="false"
                  onChange={(event) => setRecord(event.target.value)}
                ></input>
                No
              </label>
            </formfield>
          </form>
        </div>
      </section>
    </>
  );
}

export default Streaming;
