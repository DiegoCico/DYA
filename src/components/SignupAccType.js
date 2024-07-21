import React from "react";
import '../css/Signup.css';

export default function SignupAccType({ handleRouteChange }) {
    return (
        <div className="main-container">
            <AccountType 
                title="Parents, over here" 
                imgSrc={`${process.env.PUBLIC_URL}/parent.png`} 
                overlayClass="overlay-left" 
                description="Few words about parent account" 
                handleRouteChange={() => handleRouteChange('/signup/parent')} 
            />
            <AccountType 
                title="Students!" 
                imgSrc={`${process.env.PUBLIC_URL}/student.png`} 
                overlayClass="overlay-right" 
                description="Few words about student account" 
                handleRouteChange={() => handleRouteChange('/signup/child')} 
            />
        </div>
    );
}

function AccountType({ title, imgSrc, overlayClass, description, handleRouteChange }) {
    return (
        <div className="container">
            <h2>{title}</h2>
            <img src={imgSrc} className="image" alt={title} />
            <div className={overlayClass}>
                <h3>{description}</h3>
                <div className="overlay-button">
                    <button className="signup-btn" onClick={handleRouteChange}>Sign Up</button>
                </div>
            </div>
        </div>
    );
}
