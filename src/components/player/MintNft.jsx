import React, { useEffect } from 'react';
import "./MintNft.scss";
import ConfettiExplosion from 'react-confetti-explosion';
import classicChords from "../../contract/artifacts/classicChords.json"
import market from "../../contract/artifacts/market.json"
import { ethers } from "ethers";
import { Web3Storage } from 'web3.storage';
import SellCollectionSingle from "./sell/sell-collection-single";
import {Link, useNavigate} from 'react-router-dom';


function MintNft(props) {
    const market_address = "0x381b7683D0ce531EE79b8F91446C1342B3c9ddeD";
    const classicChords_address = "0xC87abfc6d320E61C31F35D48fBA3E2E0c0308Bf3";
  
    const [isExploding, setIsExploding] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    // const [numToken, setNumToken] = React.useState(true);
    // const [name, setName] = React.useState(true);
    // const [description, setDescription] = React.useState(true);


    const getTokeUri = async() =>{
        const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDllOTgwOTYxRDc1M0QwNUEzODlDZUU1RThCRjA5NjI3QzkwYzQ2RTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjgxOTEzODY1MzksIm5hbWUiOiJjbGFzc2ljX2Nob3JkcyJ9.TKUEsNlcVJQvImOVlnZqCYEQPsjZb3RmXgSAR5D9vng" })
        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const video = new File([props.file], name+'.webm', {
          type: props.file.type,
        });
        const video_file_url = await client.put([video], {
            name: name,
            maxRetries: 3,
        })
        const metadata = {   
            "description": description,      
            "image": "https://ipfs.io/ipfs/" + video_file_url,  
            "name": name,   
        }
        const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
        const metadata_cid = await client.put([blob], {
            name: name+"_metadata",
            maxRetries: 3,
        })
        return metadata_cid
    } 
  
    console.log(props);
    useEffect(() => {
        console.log(open);
        setOpen(props.opened);
    },[])

    const mint = async() => {
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
                const numToken = document.getElementById("num_token").value;
                const contract = new ethers.Contract(classicChords_address, classicChords, signer);
                const uri = await getTokeUri();
                const tx = await contract.mint(numToken,uri);
                tx.wait();
                setIsExploding(true);
                } else {
                alert("Please connect to the bitTorent Network!");
              }
            }
          } catch (error) {
            console.log(error);
          }
        }     
        
    return (
        <div className="mint">

        { open ? ( <div className='mint-nft-main'>
            <div className="mint-nft-container">
                <div className="mint-nft-header">
                    <h2 className="mint-nft-h2">Mint the ART</h2>
                </div>
                <div className="mint-nft-data">
                    <div className="mint-nft-video">
                        <video className='mint-nft-v' src={props.file_url} controls download />

                    </div>
                    <div className="mint-nft-name">
                        <input type="text" placeholder='Name' className='mint-nft-n' id="name" />
                    </div>
                    <div className="mint-nft-description">
                        <textarea className='mint-nft-d' placeholder='Description' id="description" ></textarea>
                    </div>
                    <div className="mint-nft-qty">
                        <input type="number" placeholder='No. of NFTs' className='mint-nft-num' id="num_token" />
                    </div>
                    {/* <div className="mint-nft-price">
                        <input type="number" placeholder='Price in TRX' className='mint-nft-p' />
                    </div> */}
                    <div className="mint-nft-btn">
                        <button className="mint-nft-b" onClick={() => { mint(); }}>Mint{isExploding ? <ConfettiExplosion particleCount={300} height={1080} width={1080} /> : null}</button>
                    </div>
                </div>
            </div>
        </div>) :null
    }
    </div>
    ) 
}

export default React.forwardRef(MintNft);