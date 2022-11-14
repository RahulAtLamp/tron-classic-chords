import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import "./profile.scss";
import { Collections } from "../explore/artist-single/collection_dummy";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import classicChords from "../../contract/artifacts/classicChords.json"
import market from "../../contract/artifacts/market.json"
import user from  "../../contract/artifacts/market.json"

const Profile = () => {
    const { isConnected, address } = useAccount();
    const [profileWindow, showProfileWindow] = useState(false);
    const fileRef = useRef(null);
    const editUserPopup = useRef(null);
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: "", bio: "", profile_pic: null })
    const [chain, setChainStatus] = useState(false);
    const [profileImage, setprofileImage] = useState(null);

    const user_address = "0x30967c83b2b0f747737b40b048C025AF4462741C";
    const classicChords_address = "0xed01Ed9D4dfa9BCb6540F71539c3D52EB3598212";

    const firstFive = Collections.slice(0, 5);
    const lastFive = Collections.slice(-5);

    const getProfile = async () => {
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
                    const tx = await contract.userMapping(address);
                    console.log(tx);
                } else {
                    // alert("Please connect to the bitTorent Network!");
                    setChainStatus(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const addChain = () => {
        if (window.ethereum) {
            window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                    chainId: "0x405",
                    rpcUrls: ["https://pre-rpc.bittorrentchain.io/"],
                    chainName: "BitTorrent Chain Donau",
                    // nativeCurrency: {
                    //     name: "BitTorrent",
                    //     symbol: "BTT",
                    //     decimals: 18
                    // },
                    blockExplorerUrls: ["https://testscan.bittorrentchain.io/"]
                }]
            })
        } else {
            alert("Please Install a wallet to proceed.")
        }
    }

    const checkChain = async () => {
        if (window.ethereum) {
            const { ethereum } = window;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const { chainId } = await provider.getNetwork();
            if (chainId !== 1029) {
                setChainStatus(true);
                return true;
            } else {
                setChainStatus(false);
                return false;
            }

        } else {
            alert("Please install a wallet.")
        }
    }

    const addUserData = () => {
        
    }


    useEffect(() => {
        if (!isConnected) {
            navigate("/");
        }

        checkChain();

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

    useEffect(() => {
        console.log(userData);
    }, [userData])

    useEffect(() => {
        console.log(profileImage);
        if (profileImage) {
            const image = URL.createObjectURL(profileImage);
            console.log(image);
            setUserData({ ...userData, profile_pic: image });
        }
    }, [profileImage])

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
                    <h3 className="profile-address">{address ? address.slice(0, 4) + "...." + address.slice(-5) : null} </h3>
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
                                <input type="file" ref={fileRef} onChange={(e) => { setprofileImage(e.target.files[0]) }} hidden />
                                <div className="update-profile-pic" onClick={() => { fileRef.current.click() }}>
                                    <img src={userData.profile_pic ? userData.profile_pic : "images/man.png"} alt="profile pic preview" className="profile-pic-preview" />
                                </div>
                                <input className="profile-username" type="text" placeholder="Username" onChange={(e) => { setUserData({ ...userData, name: e.target.value }) }} />
                                <textarea className="profile-bio" placeholder="Add your bio here..." onChange={(e) => { setUserData({ ...userData, bio: e.target.value }) }} />
                                <button className="user-update-btn" onClick={() => { addUserData() }}>Update Details</button>
                            </div>
                        </div>
                    </div>
                    :
                    null
            }
            {
                chain
                    ?
                    <div className="add-chain-main">
                        <div className="add-chain-box">
                            <p className="add-chain-message">
                                Currently our application only supports bittorrent testnet. Please add the BTT chain. If you have already added please switch to BTT.
                            </p>
                            <button className="add-chain-btn" onClick={() => { addChain() }}>add chain</button>
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default Profile;
