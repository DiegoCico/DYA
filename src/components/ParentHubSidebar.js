import React from "react";
import '../css/ParentHub.css';

export default function ParentHubSidebar() {
    return (
        <div className="parent-hub-sidebar-container">
            <div className="sidebar-title-container">
                <i class="fa-solid fa-chart-line"></i>
                <h2>Parent Hub</h2>
            </div>
            <div className="border"></div>
            <div className="sidebar-buttons-container">
                <button className="sidebar-button">
                    <i class="fa-solid fa-table-columns"></i>
                    <h3>Dash</h3>
                </button>
                <button className="sidebar-button">
                    <i class="fa-solid fa-user"></i>
                    <h3>Profile</h3>
                </button>
                <button className="sidebar-button">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    <h3>Sign Out</h3>
                </button>
            </div>
        </div>
    )
}