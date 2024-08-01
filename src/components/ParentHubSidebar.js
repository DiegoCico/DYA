import React from "react";
import '../css/ParentHub.css';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function ParentHubSidebar(props) {
    const { openDash, openProfile } = props

    const navigate = useNavigate()

    const handleSignOut = (auth) => {
        signOut(auth).then(() => {
            navigate('/')
        }).catch((error) => {
            <p className="error">{error.message}</p>
        })
    }

    return (
        <div className="parent-hub-sidebar-container">
            <div className="sidebar-title-container">
                <i className="fa-solid fa-chart-line"></i>
                <h2>Parent Hub</h2>
            </div>
            <div className="border"></div>
            <div className="sidebar-buttons-container">
                <button className="sidebar-button" onClick={openDash}>
                    <i className="fa-solid fa-table-columns"></i>
                    <h3>Dash</h3>
                </button>
                <button className="sidebar-button" onClick={openProfile}>
                    <i className="fa-solid fa-user"></i>
                    <h3>Profile</h3>
                </button>
                <button className="sidebar-button" onClick={() => handleSignOut(auth)}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <h3>Sign Out</h3>
                </button>
            </div>
        </div>
    )
}