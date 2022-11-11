import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import "./profile.scss";

const Profile = () => {
    const { isConnected } = useAccount();
    const navigate = useNavigate();

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
                    1
                </div>
                <div className="profile-pic-move-up">
                    <div className="profile-pic-holder">
                        <img className="profile-pic" src="images/profile.svg" alt="profile image" />
                    </div>
                </div>
            </div>
            <div className="profile-user-details">
                
            </div>
        </div>
    )
}

export default Profile;
