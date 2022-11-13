import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import "./profile.scss";
import { Collections } from "../explore/artist-single/collection_dummy";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import classicChords from "../../contract/artifacts/classicChords.json"
import market from "../../contract/artifacts/market.json"


const Profile = () => {
    const { isConnected, address } = useAccount();
    const [profileWindow, showProfileWindow] = useState(false);
    const fileRef = useRef(null);
    const editUserPopup = useRef(null);
    const navigate = useNavigate();

    const market_address = "0x0caC8C986452628Ed38483bcEE0D1cF85816946D";
    const classicChords_address = "0xed01Ed9D4dfa9BCb6540F71539c3D52EB3598212";

    const firstFive = Collections.slice(0, 5);
    const lastFive = Collections.slice(-5);

    const getProfile = async() => {
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
                const contract = new ethers.Contract(market_address, market, signer);
                const tx = await contract.userMapping(address);
                console.log(tx);
                } else {
                alert("Please connect to the bitTorent Network!");
              }
            }
          } catch (error) {
            console.log(error);
          }
        }     


    useEffect(() => {
        if (!isConnected) {
            navigate("/");
        }
        getProfile()
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (editUserPopup.current && !editUserPopup.current.contains(event.target)) {
                showProfileWindow(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editUserPopup])

    useEffect(() => {
        if (!isConnected) {
            navigate("/");
        }
    }, [isConnected]);


    return (
        <div className="profile-main">
            <div className="profile-images">
                <div className="profile-background-holder">
                    <img className="profile-background" src="images/default-background.jpg" />
                </div>
                <div className="profile-pic-move-up">
                    <div className="profile-pic-holder">
                        <img className="profile-pic" src="images/profile.svg" alt="profile image" />
                    </div>
                </div>
            </div>
            <div className="edit-profile">
                <img className="edit-profile-button" src="images/edit-btn.svg" onClick={() => { showProfileWindow(true) }} />
            </div>
            <div className="profile-user-details">
                <div className="profile-details-holder">
                    <h2 className="profile-username">Unknown</h2>
                    <h3 className="profile-address">${address.slice(0, 4) + "...." + address.slice(-5)} </h3>
                    <div className="profile-bio-holder">
                        <p className="profile-bio">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, molestias officiis non quod illum suscipit aspernatur fugit expedita, sunt eligendi, nisi dicta quae veniam consequuntur quos repellat molestiae recusandae explicabo! Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus assumenda ut et suscipit quaerat, nihil est deleniti enim officia modi itaque a atque ex doloribus aliquam reprehenderit saepe sequi placeat!
                        </p>
                    </div>
                </div>
            </div>
            <div className="nfts-minted-holder">
                <h2 className="nfts-minted-header">
                    NFTs Minted
                </h2>
                <div className="nfts-minted-container">
                    <div className="nfts-creations-list">
                        {
                            firstFive.map((collection, i) => (
                                <Link key={i} to="/artist/1/collections/1">
                                    <div className="nfts-collection-pa">
                                        <div className="nfts-bg">
                                            <div className="nfts-img">
                                                <img className="nfts-nft" src={collection.image} />
                                            </div>
                                            <div className="nfts-name" title={collection.name}>{collection.name}</div>
                                            <p className="nfts-description">{collection.description}</p>
                                            <div className="buy-button-holder">
                                                <button className="buy-button" onClick={(e) => { e.preventDefault(); }}> <span className='buy-button-tag'>BUY</span> &nbsp; <img src="/images/tl.svg" width="15px" height="15px" /><span>{collection.price}</span></button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="nfts-minted-holder">
                <h2 className="nfts-minted-header">
                    NFTs Owned
                </h2>
                <div className="nfts-minted-container">
                    <div className="nfts-creations-list">
                        {
                            lastFive.map((collection, i) => (
                                <Link key={i} to="/artist/1/collections/1">
                                    <div className="nfts-collection-pa">
                                        <div className="nfts-bg">
                                            <div className="nfts-img">
                                                <img className="nfts-nft" src={collection.image} />
                                            </div>
                                            <div className="nfts-name" title={collection.name}>{collection.name}</div>
                                            <p className="nfts-description">{collection.description}</p>
                                            <div className="buy-button-holder">
                                                <button className="buy-button" onClick={(e) => { e.preventDefault(); }}> <span className='buy-button-tag'>RENT</span> &nbsp; <img src="/images/tl.svg" width="15px" height="15px" /><span>{collection.price}</span></button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
            {
                profileWindow
                    ?
                    <div className="edit-user-popup-main">
                        <div className="edit-user-popup" ref={editUserPopup}>
                            <div className="edit-user-p-header">
                                Edit Profile
                            </div>
                            <div className="profile-information">
                                <input type="file" ref={fileRef} hidden />
                                <div className="update-profile-pic" onClick={() => { fileRef.current.click() }}>
                                    <img src="images/man.png" alt="profile pic preview" className="profile-pic-preview" />
                                </div>
                                <input className="profile-username" type="text" placeholder="Username" />
                                <textarea className="profile-bio" placeholder="Add your bio here..."></textarea>
                                <button className="user-update-btn">Update Details</button>
                            </div>
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default Profile;
