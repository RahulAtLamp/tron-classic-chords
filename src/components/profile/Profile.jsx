import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";

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
        <div>
            <div>
                Welcome to Profile
            </div>
        </div>
    )
}

export default Profile;
