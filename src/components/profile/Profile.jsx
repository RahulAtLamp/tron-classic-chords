import { useState, useEffect, useMemo } from "react";

const Profile = () => {
    const [isConnected, setIsConnected] = useState(true);
    // const {ethereum} = window.ethereum;
    useState(() => {
        if (!window.ethereum) {
            console.log("No wallet installed.");
            setIsConnected(false);
        } else {
            setIsConnected(true);
        }
    }, [])


    return (
        <div>
            <div>
                Welcome to Profile
            </div>
            {
                !isConnected
                ?
                    <div className="no-wallet-box">
                        <div className="no-wallet-box-main">
                            <div className="message">
                                Please connect to a web3 wallet to use our service.
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
