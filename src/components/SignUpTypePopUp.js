import React, { useState } from "react";
import '../css/Signup.css';
import ParentSignup from '../pages/ParentSignup';
import ChildSignup from '../pages/ChildSignup'; // Import ChildSignup component
import { useNavigate } from 'react-router-dom';

/**
 * SignUpTypePopUp Component
 *
 * The `SignUpTypePopUp` component provides a user interface for selecting between different types of sign-up options,
 * such as Parent and Student accounts. Depending on the user's choice, the corresponding sign-up form will be displayed
 * in a popup overlay.
 *
 * Props:
 * - showSignUpForm (Function): A function to handle the display of the sign-up form.
 */

export default function SignUpTypePopUp(props) {
    const { showSignUpForm } = props;
    const [showParentSignup, setShowParentSignup] = useState(false);
    const [showChildSignup, setShowChildSignup] = useState(false); // State for showing ChildSignup
    const navigate = useNavigate();

    /**
     * Handles the display of the parent signup form.
     */
    const handleParentSignup = () => setShowParentSignup(true);

    /**
     * Handles the display of the child signup form.
     */
    const handleChildSignup = () => setShowChildSignup(true);

    /**
     * Closes the parent signup form.
     */
    const handleCloseParentSignup = () => setShowParentSignup(false);

    /**
     * Closes the child signup form.
     */
    const handleCloseChildSignup = () => setShowChildSignup(false);

    return (
        <div className="sign-up-main-container">
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

/**
 * AccountType Component
 *
 * The `AccountType` component represents a clickable card that allows users to choose between different
 * account types, such as Parent and Student. When clicked, it triggers the corresponding sign-up process.
 *
 * Props:
 * - title (String): The title to display on the card.
 * - imgSrc (String): The image source URL for the card.
 * - overlayClass (String): The CSS class for the overlay effect.
 * - desc (String): A brief description of the account type.
 * - handleRouteChange (Function): The function to trigger when the card is clicked.
 */
function AccountType({ title, imgSrc, overlayClass, desc, handleRouteChange }) {
    return (
        <div>
            <h2 className="sign-up-container-title">{title}</h2>
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
