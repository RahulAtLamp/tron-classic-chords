import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import "./profile.scss";
import { Collections } from "../explore/artist-single/collection_dummy";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import classicChords from "../../contract/artifacts/classicChords.json"
import market from "../../contract/artifacts/market.json"
import user from  "../../contract/artifacts/userStream.json"
import { Web3Storage } from 'web3.storage'
import axios from "axios";

const Profile = () => {
    const { isConnected, address } = useAccount();
    const [profileWindow, showProfileWindow] = useState(false);
    const fileRef = useRef(null);
    const editUserPopup = useRef(null);
    const navigate = useNavigate();
    const [userDefault, setUserDefault] = useState({ name: null, bio: null, profile_pic: null, userId: null })
    const [userData, setUserData] = useState({ name: "", bio: "", profile_pic: null })
    const [chain, setChainStatus] = useState(false);
    const [ProfileImage, setprofileImage] = useState(null);
    const [mintedNfts, setMintedNfts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const user_address = "0x30967c83b2b0f747737b40b048C025AF4462741C";
    const classicChords_address = "0xA85cFB46795e47bB6D6C727964f668A0AE38935f";
    const market_address = "0x3C39548531bb3c9276E1e40046F64CB709aee9cb"

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
                    const tokenContract = new ethers.Contract(classicChords_address, classicChords, signer);
                    const marketContract = new ethers.Contract(market_address, market, signer);
                    const tx = await contract.userMapping(address);
                    const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDllOTgwOTYxRDc1M0QwNUEzODlDZUU1RThCRjA5NjI3QzkwYzQ2RTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjgxOTEzODY1MzksIm5hbWUiOiJjbGFzc2ljX2Nob3JkcyJ9.TKUEsNlcVJQvImOVlnZqCYEQPsjZb3RmXgSAR5D9vng" })
                    const profilePic = await client.get(tx.profileImage);
                    console.log(await marketContract.getUserNfts(address));
                    console.log(await tokenContract.mintedNfts(address));
                    const ids = await tokenContract.mintedNfts(address);
                    console.log(ids.length);
                    let nfts = []
                    for(let i=0;i<ids.length;i++){
                        const uri = await tokenContract.tokenUriMapping(ids[i].toNumber());
                        console.log(uri);
                        try{
                            await axios.get("https://ipfs.io/ipfs/"+uri.split("//")[1]).then((response) => {
                                let data = response.data
                                data.image = "https://ipfs.io/ipfs/"+data.image.split("//")[1]
                                nfts.push(response.data)
                                console.log(response.data);
                            });
                        }catch(error){
                            console.log(error);
                        }
                    }
                    console.log(nfts);
                    setMintedNfts(nfts)
                    console.log(profilePic);
                    console.log(tx);
                    setUserDefault({ name: tx.name, bio: tx.description, profile_pic: tx.profileImage, userId: tx.userId });
                    setIsLoading(true)
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
                    const contract = new ethers.Contract(user_address, user, signer);
                    return contract
                } else {
                    alert("Please connect to the bitTorent Network!");
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const addUserData = async () => {
        try {
            const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDllOTgwOTYxRDc1M0QwNUEzODlDZUU1RThCRjA5NjI3QzkwYzQ2RTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjgxOTEzODY1MzksIm5hbWUiOiJjbGFzc2ljX2Nob3JkcyJ9.TKUEsNlcVJQvImOVlnZqCYEQPsjZb3RmXgSAR5D9vng" })
            const upload = await client.put([ProfileImage], {
                name: ProfileImage.name,
                maxRetries: 3,
            });

            // console.log(upload);
            const contract = await getContract();
            if (!userDefault.name) {
                const something = await contract.registerUser(userData.name, userData.bio, upload + "/" + ProfileImage.name);
                console.log(something);
                getProfile();
                showProfileWindow(false);
            } else {
                const something = await contract.updateUser(userDefault.userId, userData.name, userData.bio, upload + "/" + ProfileImage.name);
                console.log(something);
                getProfile();
                showProfileWindow(false);
            }

        } catch (error) {
            console.log(error);
        }
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
        console.log(userDefault);
    }, [userDefault])

    useEffect(() => {
        console.log(ProfileImage);
        if (ProfileImage) {
            const image = URL.createObjectURL(ProfileImage);
            console.log(image);
            setUserData({ ...userData, profile_pic: image });
        }
    }, [ProfileImage])

    return (
        <div className="profile-main">
            <div className="profile-images">
                <div className="profile-background-holder">
                    <img className="profile-background" src="images/default-background.jpg" />
                </div>
                <div className="profile-pic-move-up">
                    <div className="profile-pic-holder">
                        <img className="profile-pic" src={userDefault.profile_pic ? `https://ipfs.io/ipfs/` + userDefault.profile_pic : "images/profile.svg"} alt="profile image" />
                    </div>
                </div>
            </div>
            <div className="edit-profile">
                <img className="edit-profile-button" src="images/edit-btn.svg" onClick={() => { showProfileWindow(true) }} />
            </div>
            <div className="profile-user-details">
                <div className="profile-details-holder">
                    <h2 className="profile-username">{userDefault.name ? userDefault.name : "Unknown"}</h2>
                    <h3 className="profile-address">{address ? address.slice(0, 4) + "...." + address.slice(-5) : null} </h3>
                    <div className="profile-bio-holder">
                        <p className="profile-bio">
                            {
                                userDefault.bio
                                    ?
                                    userDefault.bio
                                    :
                                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, molestias officiis non quod illum suscipit aspernatur fugit expedita, sunt eligendi, nisi dicta quae veniam consequuntur quos repellat molestiae recusandae explicabo! Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus assumenda ut et suscipit quaerat, nihil est deleniti enim officia modi itaque a atque ex doloribus aliquam reprehenderit saepe sequi placeat!"
                            }
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
                            isLoading ? (  mintedNfts.map((collection, i) => (
                                <Link key={i} to="/sell-nft/1">
                                    <div className="nfts-collection-pa">
                                        <div className="nfts-bg">
                                            <div className="nfts-img">
                                                <video className="nfts-nft" src={collection.image} controls />
                                            </div>
                                            <div className="nfts-name" title={collection.name}>{collection.name}</div>
                                            <p className="nfts-description">{collection.description}</p>
                                            <div className="buy-button-holder">
                                                <button className="buy-button" onClick={(e) => { e.preventDefault(); }}> <span className='buy-button-tag'>Put on sale </span> 
                                                {/*&nbsp; <img src="/images/tl.svg" width="15px" height="15px" /><span>{collection.price}</span> */}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))):null
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
                                                {/* <img className="nfts-nft" src={collection.image} /> */}
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
                                <input type="file" ref={fileRef} onChange={(e) => { setprofileImage(e.target.files[0]); }} hidden />
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
