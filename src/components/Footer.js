import React from "react";

export default function Footer() {
    return (
        <footer className="footer">
            <section className="hero">
                <img src={`${process.env.PUBLIC_URL}/branch-left.png`} alt="left-img" className="hero-img-left"/>
                <div className="hero-content">
                    <h2>Discover and Learn</h2>
                    <p>Explore our interactive games, educational videos, and fun activities!</p>
                    <button className="animated-button">Get Started</button>
                </div>
                <img src={`${process.env.PUBLIC_URL}/branch-right.png`} alt="right-img" className="hero-img-right"/>
            </section>
            <p>&copy; 2024 DYA. All rights reserved.</p>
        </footer>
    );
}
