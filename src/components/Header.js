import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/App.css"

export default function Header() {
    const navigate = useNavigate()

    const handleRouteClick = (route) => {
        navigate(route)
    }

    return (
       <div className="header">
            <button className="home-btn" onClick={() => handleRouteClick('/')}>Home</button>
            <div className="header-right">
                <button onClick={() => handleRouteClick('/')}>About</button>    {/* To be added route */}
            </div>
       </div>
    )
}