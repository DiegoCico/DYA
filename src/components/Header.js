import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/App.css"

/**
 * Header Component
 * 
 * The `Header` component renders a simple navigation bar at the top of the page.
 * It includes buttons for navigating to the home page and an "About" section (route to be added).
 * The `useNavigate` hook from `react-router-dom` is used for route navigation.
 */

export default function Header() {
    const navigate = useNavigate();

    /**
     * handleRouteClick
     * 
     * Handles the navigation to a specific route when a button is clicked.
     * 
     * @param {string} route - The path to navigate to.
     */
    const handleRouteClick = (route) => {
        navigate(route);
    }

    return (
       <div className="header">
            {/* Home button navigates to the root '/' route */}
            <button className="home-btn" onClick={() => handleRouteClick('/')}>Home</button>
            
            {/* Placeholder for additional routes, such as About */}
            <div className="header-right">
                <button onClick={() => handleRouteClick('/')}>About</button>    {/* To be added route */}
            </div>
       </div>
    )
}
