import React, { useState } from "react";
import '../css/Signup.css';
import ParentSignup from '../pages/ParentSignup';
import { useNavigate } from 'react-router-dom';

export default function SignUpTypePopUp(props) {
    const { showSignUpForm } = props;
    const [showParentSignup, setShowParentSignup] = useState(false);
    const navigate = useNavigate();

    const handleParentSignup = () => setShowParentSignup(true);
    const handleCloseParentSignup = () => setShowParentSignup(false);

    return (
        <div className="main-container">
            <AccountType
                title='Parents, over here!'
                imgSrc={`${process.env.PUBLIC_URL}/user.png`}
                overlayClass='overlay-left'
                desc='Few words about parent account'
                handleRouteChange={handleParentSignup}
            />
            <AccountType
                title='Students!'
                imgSrc={`${process.env.PUBLIC_URL}/user.png`}
                overlayClass='overlay-right'
                desc='Few words about student account'
                handleRouteChange={showSignUpForm}
            />

            {showParentSignup && (
                <div className='popup-overlay' onClick={handleCloseParentSignup}>
                    <div className='popup-content' onClick={(e) => e.stopPropagation()}>
                        <ParentSignup
                            setShowSignUpForm={setShowParentSignup}
                            toggleLoginPopUp={() => {}} // Pass appropriate toggle function if needed
                        />
                    </div>
                </div>
            )}
        </div>
    );
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
    );
}
