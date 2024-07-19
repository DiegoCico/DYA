import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function UserProfileSidebar() {
    const { uid } = useParams();
    const navigate = useNavigate()

    const handleRouteClick = (route) => {
        navigate(route)
    }
    const handleSignOut = (auth) => {
        signOut(auth).then(() => {
            navigate('/login')
        }).catch((error) => {
            <p className="error">{error.message}</p>
        })
    }
    return (
        // <div className="header">
        //     <button className="roadmap-btn" onClick={() => handleRouteClick(`/roadmap/${uid}`)}>Roadmap</button>
        //     <div className="header-right">
        //         <button className="logout-btn" onClick={() => handleSignOut(auth)}>
        //             <i className="fa-solid fa-right-from-bracket"></i>
        //         </button>
        //     </div>
        // </div>
        <div className="side-nav">
            <div className="mascot-container">
                <p>Add mascot here or something else</p>
            </div>
            <div className="btn-container">
                <button onClick={() => handleRouteClick(`/roadmap/${uid}`)}>Roadmap</button>

                <button>Profile</button>
                
                <button className="logout-btn" onClick={() => handleSignOut(auth)}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
            </div>
        </div>
    )
}