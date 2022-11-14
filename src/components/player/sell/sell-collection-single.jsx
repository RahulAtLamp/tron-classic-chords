import React, { useEffect, useState } from 'react';
import "./sell-collection-single.scss";
// import classicChords from "../../contract/artifacts/classicChords.json"
// import market from "../../contract/artifacts/market.json"
import { Collections } from '../collection_dummy';
import { ethers } from "ethers";
import axios from "axios";
// import $ from "jquery";
import DatePicker from 'react-date-picker';
import { useAccount } from "wagmi";
import { useParams } from 'react-router-dom';
import classicChords from "../../../contract/artifacts/classicChords.json"
import market from "../../../contract/artifacts/market.json"


const classicChords_address = "0xA85cFB46795e47bB6D6C727964f668A0AE38935f";
const market_address = "0x3C39548531bb3c9276E1e40046F64CB709aee9cb"

function SellCollectionSingle() {
    const { isConnected, address } = useAccount();
    const params = useParams()

    // const collection = Collections[3];
    const [sellData, setSellData] = useState({ qty: null, price: null, option: null, rent_duration: null, royalty: null });
    const [collection, setCollections] = useState({})
    const [loading, setIsLoading] = useState(false)


    const getData = async () => {
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
                    const tokenContract = new ethers.Contract(classicChords_address, classicChords, signer);
                    const marketContract = new ethers.Contract(market_address, market, signer);
                    let result = {
                    }

                    try {
                        const uri = await tokenContract.tokenUriMapping(params.id);
                        await axios.get("https://ipfs.io/ipfs/" + uri.split("//")[1]).then((response) => {
                            let data = response.data
                            data.image = "https://ipfs.io/ipfs/" + data.image.split("//")[1]
                            console.log(response.data);
                            result = response.data;
                        });
                        const balance = await tokenContract.balanceOf(address, params.id)
                        result.total_minted = balance.toNumber()
                        setCollections(result)
                    } catch (error) {
                        console.log(error);
                    }
                }
                console.log();
                setIsLoading(true)
            } else {
                alert("Please connect to the bitTorent Network!");
                // setChainStatus(true);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const sell = async () => {
        try {
            const { ethereum } = window;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const marketContract = new ethers.Contract(market_address, market, signer);
            let isAvailableForSell = null;
            let isAvailableForRent = null;
        

            if(sellData.option === "Sell"){
                isAvailableForSell = true;
                isAvailableForRent = false;
            }            
            if(sellData.option === "rent"){
                isAvailableForSell = false;
                isAvailableForRent = true;
            }


            const tx = await marketContract.createMarketItem(params.id, sellData.qty, sellData.price,isAvailableForRent,isAvailableForSell,sellData.rent_duration,sellData.royalty)
            tx.wait()
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData();
    }, [])

    useEffect(()=>{
        console.log(sellData);
    },[sellData])

    return (
        <>
            {loading ? (
                <div className='collection-main'>
                    <h2 className="collection-name">{collection.name}</h2>
                    <div className="collection-detail-holder">
                        <div className="collection-image-holder">
                            <video className='collection-image' src={collection.image} alt={collection.name} controls />
                        </div>
                        <div className="collection-sub">
                            <p className="collection-description">
                                {collection.description}
                            </p>
                            <p className="total-minted">
                                Balance
                            </p>

                            <p className="total-minted">
                                {collection.total_minted}
                            </p>

                            <input className='total-qty' type="number" placeholder='Quantity to sell' onChange={(e) => { setSellData({ ...sellData, qty: e.target.value }) }} />

                            <input className='total-price' type="number" placeholder='Price' onChange={(e) => { setSellData({ ...sellData, price: e.target.value }) }} />

                            <select className='sell-options' defaultValue={""} onChange={(e) => { setSellData({ ...sellData, option: e.target.value }) }}>
                                <option value="">--select--</option>
                                <option value="rent">Rent</option>
                                <option valu="sell">Sell</option>
                            </select>

                            {
                                sellData.option === "rent"
                                    ?
                                    <div>
                                        {/* <DatePicker className="sell-date-picker" minDate={new Date()} /> */}
                                        <span className='date-picker-title'>Rent till:</span> <input type="date" onChange={(e)=>{setSellData({...sellData, rent_duration: new Date(e.target.value).getTime()/1000});}} className="sell-date-picker" />
                                    </div>
                                    :
                                    null
                            }
                            <input className='total-price' type="number" placeholder='Royalty' onChange={(e) => { setSellData({ ...sellData, royalty: e.target.value }) }} />

                            <button className="sell-buy-button" onClick={() => { sell() }}>
                                proceed
                            </button>
                        </div>
                    </div>
                </div>) : null}
        </>
    )
}

export default SellCollectionSingle