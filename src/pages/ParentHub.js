import React, { useState } from "react";
import '../css/ParentHub.css';
import ParentHubSidebar from '../components/ParentHubSidebar';
import ParentHubDash from '../components/ParentHubDash';
import ParentHubProfile from '../components/ParentHubProfile';

export default function ParentHub() {
    const [dashOpen, setDashOpen] = useState(true)
    const [profileOpen, setProfileOpen] = useState(false)

    const openDash = () => {
        setDashOpen(true)
        setProfileOpen(false)
    }
    const openProfile = () => {
        setProfileOpen(true)
        setDashOpen(false)
    }

    return (
        <div className="parent-hub-page">
            <ParentHubSidebar openDash={openDash} openProfile={openProfile}/>
            { dashOpen && (
                <ParentHubDash />
            )}
            { profileOpen && (
                <ParentHubProfile />
            )}
        </div>
    )
}