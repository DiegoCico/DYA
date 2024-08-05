import React, { useState } from "react";
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import '../css/Signup.css';
import ChildSignup from "./ChildSignup";

export default function NewLogin(props) {
    const { handleRouteChange, toggleSignUpPopUp, toggleLoginPopUp } = props;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const [showGoogleErrorPopup, setShowGoogleErrorPopup] = useState(false); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                alert('User does not exist, please sign up!');
                toggleLoginPopUp(); // Close the login popup
                setTimeout(() => {
                    toggleSignUpPopUp(); // Open the signup popup
                }, 300); 
                return;
            }

            const userData = docSnap.data();
            if (userData.isParent) {
                handleRouteChange(`/parenthub/${user.uid}`);
            } else {
                handleRouteChange(`/roadmap/${user.uid}`);
            }
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.');
        }
    };

    const handleGoogleSignIn = async () => {
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({ prompt: 'select_account' });
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user;
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            const parentDocRef = doc(db, 'parents', user.uid);
            const parentDocSnap = await getDoc(parentDocRef);
            
            if (!userDocSnap.exists() && !parentDocSnap.exists()) {
                setShowSignUpForm(true);
                setShowGoogleErrorPopup(true);
                toggleLoginPopUp(); 
                setTimeout(() => {
                    toggleSignUpPopUp(); // Open the signup popup
                }, 300); // Adding a delay to ensure the login popup fully closes before opening signup
            } else {
                let fetchedData;
                if (parentDocSnap.exists()) {
                    fetchedData = parentDocSnap.data();
                } else if (userDocSnap.exists()) {
                    fetchedData = userDocSnap.data();
                }

                if (fetchedData.isParent) {
                    handleRouteChange(`/parenthub/${user.uid}`);
                } else {
                    handleRouteChange(`/roadmap/${user.uid}`);
                }
            }
        } catch (error) {
            setError(error.message || 'Login with Google failed. Please try again.');
        }
    };

    return (
        <div className="child-signup-container">
            <div className="title">
                <h1>Let's get back</h1>
            </div>
            <div className="signup-login-container">
                <h3>New? Create an account here</h3>
                <button
                    className="signin-button"
                    onClick={() => {
                        toggleLoginPopUp();
                        toggleSignUpPopUp();
                    }}
                >Sign Up</button>
            </div>
            <div className="signup-box">
                <form onSubmit={handleSubmit}>
                    <input
                        className="signup-input"
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="signup-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p>{error}</p>}
                    <div className="signup-form-buttons">
                        <button className="signup-form-submit-btn" type="submit">Log In</button>
                        <h2 className="signup-form-or">or</h2>
                        <button onClick={handleGoogleSignIn} className="signup-form-google-btn"><i className="fa-brands fa-google"></i>Continue with Google</button>
                    </div>
                </form>
            </div>
            {showGoogleErrorPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Account Not Found</h3>
                        <p>No account found with the provided Google credentials. Please sign up.</p>
                        <button onClick={() => setShowGoogleErrorPopup(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
