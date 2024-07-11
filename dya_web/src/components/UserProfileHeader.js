import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function UserProfileHeader(props) {
    const { userData } = props
    const navigate = useNavigate()

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
        <div className="header">
            <button className="roadmap-btn" onClick={() => handleRouteClick('/roadmap')}>Roadmap</button>
            <div className="header-right">
                <button onClick={() => handleSignOut(auth)}>Log Out</button>
            </div>
        </div>
    )
}