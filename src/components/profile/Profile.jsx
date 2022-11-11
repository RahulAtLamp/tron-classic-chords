import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import "./profile.scss";
import { Collections } from "../explore/artist-single/collection_dummy";
import { Link } from "react-router-dom";

const Profile = () => {
    const { isConnected, address } = useAccount();
    const [profileWindow, showProfileWindow] = useState(false);
    const fileRef = useRef(null);
    const navigate = useNavigate();

    const firstFive = Collections.slice(0, 5);
    const lastFive = Collections.slice(-5);

    useEffect(() => {
        if (!isConnected) {
            navigate("/");
        }
    }, []);

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
                <img className="edit-profile-button" src="images/edit-btn.svg" onClick={() => { }} />
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
                        <div className="edit-user-popup">
                            <div className="edit-user-p-header">
                                Edit Profile
                            </div>
                            <div className="profile-information">
                                <input type="file" ref={fileRef} hidden />
                                <div className="update-profile-pic">
                                    <img src="images/man.png" alt="profile pic preview" onClick={()=>{ fileRef.current.click() }} className="profile-pic-preview" />
                                </div>
                                <input type="text" />
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
