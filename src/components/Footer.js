import React from "react";

/**
 * Footer Component
 * 
 * This component renders the footer section of the webpage, including a hero section with a call to action 
 * and some decorative images. The footer also includes a copyright notice.
 * 
 * The hero section encourages users to explore the interactive games, educational videos, and activities available 
 * on the platform.
 */

export default function Footer() {
    return (
        <footer className="footer">
            <section className="hero">
                {/* Decorative image on the left side */}
                <img src={`${process.env.PUBLIC_URL}/branch-left.png`} alt="left-img" className="hero-img-left"/>
                
                {/* Hero content with a heading, description, and a button */}
                <div className="hero-content">
                    <h2>Discover and Learn</h2>
                    <p>Explore our interactive games, educational videos, and fun activities!</p>
                    <button className="animated-button">Get Started</button>
                </div>
                
                {/* Decorative image on the right side */}
                <img src={`${process.env.PUBLIC_URL}/branch-right.png`} alt="right-img" className="hero-img-right"/>
            </section>
            
            {/* Copyright notice */}
            <p>&copy; 2024 DYA. All rights reserved.</p>
        </footer>
    );
}
