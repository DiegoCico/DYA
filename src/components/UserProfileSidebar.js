import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import UserProfile from "../pages/UserProfile";

export default function UserProfileSidebar( userData ) {
    const { uid } = useParams();
    const navigate = useNavigate()
    const [showUserProfile, setShowUserProfile] = useState(false)

    const toggleUserProfile = () => {
        setShowUserProfile(!showUserProfile)
    }

    const handleRouteClick = (route) => {
        navigate(route)
    }
    const handleSignOut = (auth) => {
        signOut(auth).then(() => {
            navigate('/')
        }).catch((error) => {
            <p className="error">{error.message}</p>
        })
    }
    return (
        <div className="side-nav">
            <div className="mascot-container">
                <p>Add mascot here or something else</p>
            </div>
            <div className="btn-container">
                <button onClick={() => handleRouteClick(`/roadmap/${uid}`)}>Roadmap</button>

                <button onClick={toggleUserProfile}>Profile</button>
                
                <button className="logout-btn" onClick={() => handleSignOut(auth)}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
            </div>
            {showUserProfile && userData && (
                <UserProfile userData={userData} close={toggleUserProfile} />
            )}
        </div>
    )
}