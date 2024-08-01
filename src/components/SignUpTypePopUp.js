import React, { useState } from "react";
import '../css/Signup.css';
import ParentSignup from '../pages/ParentSignup';
import ChildSignup from '../pages/ChildSignup'; // Import ChildSignup component
import { useNavigate } from 'react-router-dom';

export default function SignUpTypePopUp(props) {
    const { showSignUpForm } = props;
    const [showParentSignup, setShowParentSignup] = useState(false);
    const [showChildSignup, setShowChildSignup] = useState(false); // State for showing ChildSignup
    const navigate = useNavigate();

    const handleParentSignup = () => setShowParentSignup(true);
    const handleChildSignup = () => setShowChildSignup(true); // Handler for showing ChildSignup
    const handleCloseParentSignup = () => setShowParentSignup(false);
    const handleCloseChildSignup = () => setShowChildSignup(false); // Handler for closing ChildSignup

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
                handleRouteChange={handleChildSignup} 
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

            {showChildSignup && ( 
                <div className='popup-overlay' onClick={handleCloseChildSignup}>
                    <div className='popup-content' onClick={(e) => e.stopPropagation()}>
                        <ChildSignup
                            setShowSignUpForm={setShowChildSignup}
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
                        {/* <p>{desc}</p>  Commented temporarily */}
                        <button className="overlay-btn" onClick={handleRouteChange}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
