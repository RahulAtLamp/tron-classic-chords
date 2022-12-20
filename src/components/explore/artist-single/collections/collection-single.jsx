import React, { useEffect, useState, useRef } from 'react';
import "./collection-single.scss";
import { Collections } from '../collection_dummy';
import market from "../../../../contract/artifacts/market.json"
import { ethers } from "ethers";
import classicChords from "../../../../contract/artifacts/classicChords.json"
import axios from "axios";
import { useParams } from 'react-router-dom';
import Loading3 from '../../../../loading3';

// const user_address = "0xb14bd4448Db2fe9b4DBb1D7b8097D28cA57A8DE9";
// const classicChords_address = "0x01daa94030dBd0a666066483D89E7927BE0904Ed";
// const market_address = "0x086E4fDFb8CEb2c21bD1491a6B86Ce8eB4C01970"

function CollectionSingle() {
    const collection = Collections[3];
    const params = useParams();
    const [username, setUsername] = useState("");
    const [userData, setUserData] = useState({ name: null, description: null, image: null, totalQty: null, price: null });
    const [nftQty, setNftQty] = useState(null);
    const [price, setPrice] = useState(null);
    const [forRent, setForRent] = useState(false);
    const [tokenId, setTokenId] = useState(null);
    const [userQty, setUserQty] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const qtyRef = useRef(null);

    console.log(process.env.REACT_APP_CLASSIC_CHORDS);

    const getNftData = async () => {
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
                    const tokenContract = new ethers.Contract(process.env.REACT_APP_CLASSIC_CHORDS, classicChords, signer);
                    const marketContract = new ethers.Contract(process.env.REACT_APP_MARKET_ADDRESS, market, signer);
                    let result = {
                    }

                    try {
                        const market_item = await marketContract.marketItemsMapping(params.id);
                        console.log(market_item);
                        setTokenId(market_item.tokenId.toNumber());
                        const uri = await tokenContract.tokenUriMapping(market_item.tokenId.toNumber());

                        console.log(uri);
                        await axios.get("https://ipfs.io/ipfs/" + uri.split("//")[1]).then((response) => {
                            let data = response.data
                            data.image = "https://ipfs.io/ipfs/" + data.image.split("//")[1]
                            console.log(response.data);
                            result = response.data;
                        });
                        console.log(result);
                        setUsername(result.name);
                        setUserData({ ...userData, name: result.name });
                        setUserData({ ...userData, description: result.description });
                        setUserData({ ...userData, image: result.image });
                        setNftQty(market_item.quantity.toNumber());
                        setPrice(market_item.price.toNumber());
                        setForRent(market_item.isAvailableOnRent);
                        // const balance = await tokenContract.balanceOf(address, params.id)
                        // result.total_minted = balance.toNumber()
                        // setCollections(result)
                    } catch (error) {
                        console.log(error);
                    }
                }
                // console.log();
                // setIsLoading(true)
            } else {
                alert("Please connect to the bitTorent Network!");
                // setChainStatus(true);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const buyOrRent = async () => {
        setIsLoading(true);
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
                    const tokenContract = new ethers.Contract(process.env.REACT_APP_CLASSIC_CHORDS, classicChords, signer);
                    const marketContract = new ethers.Contract(process.env.REACT_APP_MARKET_ADDRESS, market, signer);

                    try {

                        console.log(userData);

                        if (forRent) {
                            const rent = await marketContract.rentNft(params.id, tokenId, userQty, { value: price * userQty });
                            console.log(rent);
                            qtyRef.current.value="";
                            getNftData();
                        } else {
                            const buy = await marketContract.buyNft(params.id, tokenId, userQty, { value: price * userQty });
                            console.log(buy);
                            qtyRef.current.value="";
                            getNftData();
                        }

                    } catch (error) {
                        console.log(error);
                    }
                }
                // console.log();
                setIsLoading(false)
            } else {
                alert("Please connect to the bitTorent Network!");
                // setChainStatus(true);
                setIsLoading(false);
            }

        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getNftData();
    }, [])

    return (
        <div className='collection-main'>
            <h2 className="collection-name">{username}</h2>
            <div className="collection-detail-holder">
                <div className="collection-image-holder">
                    <video className='collection-image' src={userData.image} alt={userData.image} controls />
                </div>
                <div className="collection-sub">
                    <p className="collection-description">
                        {userData.description}
                    </p>
                    <p className="total-minted">
                        Total Quantity : {nftQty}
                    </p>
                    <p className="total-minted">
                        Price Per Unit : &nbsp; {price} &nbsp; <img src="/images/btt.svg" height="28px" width="28px" />
                    </p>
                    <input type="number" ref={qtyRef} placeholder='Qty to purchase/rent' onChange={(e) => { setUserQty(e.target.value) }} title="Qty to purchase/rent" className='qty-to-p' />
                    <button className="collection-buy-button" onClick={() => { buyOrRent() }}>
                        <span className='buy-button-tag'>{forRent ? "Rent It" : "Buy"}</span>
                        {/* &nbsp; <img src="/images/tl.svg" width="15px" height="15px" /><span>{collection.price}</span> */}
                    </button>
                </div>
            </div>
            {
                isLoading
                    ?
                    <div className='loading-main'><Loading3 /></div>
                    :
                    null
            }
        </div>
    )
}

export default CollectionSingle