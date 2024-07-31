import React, { useState } from "react";
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../css/Signup.css';
import ChildSignup from "./ChildSignup";

const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 12);
};

export default function NewLogin(props) {
    const { handleRouteChange, toggleSignUpPopUp, toggleLoginPopUp } = props;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showSignUpForm, setShowSignUpForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                setError('User does not exist, create a new account');
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
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                setShowSignUpForm(true);
                toggleLoginPopUp(); // Hide the login pop-up
            } else {
                const userData = docSnap.data();
                if (userData.isParent) {
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
                        {/* <h2 className="signup-form-or">or</h2> */}
                        {/* <button onClick={handleGoogleSignIn} className="signup-form-google-btn"><i className="fa-brands fa-google"></i>Continue with Google</button> */}
                    </div>
                </form>
            </div>
        </div>
    );
}
