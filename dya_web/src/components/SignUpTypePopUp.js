import React from "react";
import '../css/Signup.css'

export default function SignUpTypePopUp(props) {
    const { showSignUpForm } = props
    return (
        <div className="main-container">
            <AccountType
                title='Parents, over here!'
                imgSrc='user.png'
                overlayClass='overlay-left'
                desc='Few words about parent account'
                handleRouteChange={showSignUpForm}
            />
            <AccountType
                title='Students!'
                imgSrc='user.png'
                overlayClass='overlay-right'
                desc='Few words about student account'
                handleRouteChange={showSignUpForm}
            />
        </div>
    )
}

function AccountType({ title, imgSrc, overlayClass, desc, handleRouteChange }) {
    return (
        <div>
            <h2 className="container-title">{title}</h2>
            <div className="container">
                <img src={imgSrc} alt={title} className="image" />
                <div className={overlayClass}>
                    <div className="desc">
                        <p>{desc}</p>
                        <button className="overlay-btn" onClick={handleRouteChange}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    )
}