import React from "react";
import '../css/ParentHub.css';
import ParentHubSidebar from '../components/ParentHubSidebar';

export default function ParentHub() {
    return (
        <div className="parent-hub-page">
            <ParentHubSidebar />
            <div className="parent-hub-main-container">
                <h2>Parent Hub Main Content Area</h2>
            </div>
        </div>
    )
}