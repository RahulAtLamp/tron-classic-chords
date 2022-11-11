import React, { useState, useEffect } from "react";
import "./styles.css";
import { IoCloseOutline } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import { Web3Storage } from 'web3.storage';
import { async } from "q";



export default function Minting(props) {
    console.log(props);
  const [modal, setModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
        setModal(!modal);
    }, [props])    

  const spinner = () => {
    setVideoLoading(!videoLoading);
  };

  const Mint = async() =>{
    const client = new Web3Storage({ token : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDllOTgwOTYxRDc1M0QwNUEzODlDZUU1RThCRjA5NjI3QzkwYzQ2RTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjgxOTEzODY1MzksIm5hbWUiOiJjbGFzc2ljX2Nob3JkcyJ9.TKUEsNlcVJQvImOVlnZqCYEQPsjZb3RmXgSAR5D9vng"})
    console.log(props.file);
    const myFile = new File([props.file], 'test.webm', {
        type: props.file.type,
    });
    
    console.log(await client.put([myFile], {
        name: 'Test',
        maxRetries: 3,
      })); 
  }




  return (
    <div className="App">
        {modal ? (
          <section className="modal__bg">
            <div className="modal__align">
              <div className="modal__content" modal={modal}>
                <IoCloseOutline
                  className="modal__close"
                  arial-label="Close modal"
                  onClick={setModal}
                />
                <div className="modal__video-align">
                  {videoLoading ? (
                    <div className="modal__spinner">
                      <BiLoaderAlt
                        className="modal__spinner-style"
                        fadeIn="none"
                      />
                    </div>
                  ) : null}
                  <iframe
                    className="modal__video-style"
                    onLoad={spinner}
                    loading="lazy"
                    width="700"
                    height="400"
                    src={props.url}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                  {/* {props.url} */}
                  <button onClick={() => {props.url.click();}} > Download </button>
                  <button onClick={() => Mint()} > Upload </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}
    </div>
  );
}
