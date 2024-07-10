import React from "react";
import '../css/Signup.css';

export default function SignupAccType(props) {
    const { handleRouteChange } = props
    return (
        <div className="main-container">
            <div className="container">
                <h2>Parents, over here</h2>
                <img src="parent.png" className="image" alt="parent"/>
                <div className="overlay-left">
                    <h3>Few words about parent account</h3>
                    <div className="overlay-button">
                        <button className="signup-btn" onClick={() => handleRouteChange('/signup/parent')}>Sign Up</button>
                    </div>
                </div>
            </div>
            <div className="container">
                <h2>Students!</h2>
                <img src="student.png" className="image" alt="student"/>
                <div className="overlay-right">
                    <h3>Few words about student account</h3>
                    <div className="overlay-button">
                        <button className="signup-btn" onClick={() => handleRouteChange('/signup/child')}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    )
}