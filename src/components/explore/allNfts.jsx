import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import market from "../../contract/artifacts/market.json";
import user from "../../contract/artifacts/userStream.json";
import { Link } from 'react-router-dom';
import "./allnfts.scss";

const user_address = "0xb14bd4448Db2fe9b4DBb1D7b8097D28cA57A8DE9";
const classicChords_address = "0x01daa94030dBd0a666066483D89E7927BE0904Ed";
const market_address = "0x086E4fDFb8CEb2c21bD1491a6B86Ce8eB4C01970"
const RPC_ENDPOINT = "https://pre-rpc.bittorrentchain.io/";

function AllNfts() {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getNfts();
    }, [])

    const getContract = async () => {
        try {
            // const { ethereum } = window;
            // if (ethereum) {
            //   const provider = new ethers.providers.Web3Provider(ethereum);
            //   const signer = provider.getSigner();
            //   if (!provider) {
            //     console.log("Metamask is not installed, please install!");
            //   }
            //   const { chainId } = await provider.getNetwork();
            //   console.log("switch case for this case is: " + chainId);
            //   if (chainId === 1029) {
            //     const contract = new ethers.Contract(market_address, market, signer);
            //     return contract
            //   } else {
            //     alert("Please connect to the bitTorent Network!");
            //   }
            // }

            const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
            const contract = new ethers.Contract(process.env.REACT_APP_MARKET_ADDRESS, market, provider);
            return contract
        } catch (error) {
            console.log(error);
        }
    }

    const getNfts = async () => {
        const contract = await getContract()
        console.log(contract);
        const artists = await contract.getListedNfts();
        setNfts(artists);
        setLoading(false)
        console.log(artists);
    }


    return (
        <div className='nfts-main'>
            <div className="nfts-header">All NFTs</div>
            <div className="artist-creations-list-container">
                <div className="artist-creations-list">
                    {
                        nfts.length > 0
                            ?
                            nfts.map((collection, i) => (
                                <Link key={i} to={"/collection/" + collection.id}>
                                    <div className="artist-collection-pa">
                                        <div className="exp-bg">
                                            <div className="exp-img">
                                                <video className="exp-nft" src={collection.image} controls />
                                            </div>
                                            <div className="exp-name" title={collection.name}>{collection.name}</div>
                                            <p className="exp-description">{collection.description}</p>
                                            {/* <div className="buy-button-holder">
                          <button className="buy-button" onClick={(e) => { e.preventDefault(); }}> <span className='buy-button-tag'>BUY</span> &nbsp; <span>{collection.price}</span></button>
                        </div> */}
                                        </div>
                                    </div>
                                </Link>
                            ))
                            :
                            <h4>No Nfts</h4>
                    }
                </div>
            </div>
        </div>
    )
}

export default AllNfts