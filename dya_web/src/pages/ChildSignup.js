import React, { useState } from "react";
import '../css/Signup.css';
import Header from '../components/Header';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 12);
};

export default function ChildSignup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const initializeUser = async (user, google) => {
        const uniqueId = generateUniqueId();
        if (google) {
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                currentActivity: 1,
                programmingLanguages: ["Python"],
                name: user.displayName || user.email.split('@')[0],
                uniqueId: uniqueId
            })
        } else {
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                currentActivity: 1,
                programmingLanguages: ["Python"],
                uniqueId: uniqueId
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords need to match!');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await initializeUser(user, false);

            console.log('Signup successful', user.uid);
            navigate(`/signupInfo/${user.uid}/1`); // Navigate to additional info page
            
        } catch (error) {
            setError(error.message || 'Signup failed. Please try again.');
        }
    };
    
    const googleProvider = new GoogleAuthProvider()
    const handleGoogleSignUp = async() => {
        try {
            const res = await signInWithPopup(auth, googleProvider)
            const userCredential = GoogleAuthProvider.credentialFromResult(res)
            const user = res.user 
            
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) {
                initializeUser(user, true)
                navigate(`/signupInfo/${user.uid}/2`); // Navigate to additional info page

            } else {
                navigate(`/roadmap/${user.uid}`)
            }
        } catch (error) {
            const errorMessage = error.message
            setError(errorMessage)
        }
    }

    return (
        <>
            <Header />
            <div className="child-main-container">
                <div className="left-container">
                    <p>Child account description.</p>
                    <p>Image of a kid coding</p>
                </div>
                <div className="right-container">
                    <h1>Get started learning!</h1>
                    <div className="signup-login-container">
                        <h3>Already joined?</h3>
                        <button
                            className="signin-button"
                            onClick={() => navigate('/login')}
                        >
                            Log In
                        </button>
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
                            <input
                                className="signup-input"
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {error && <p>{error}</p>}
                            <div className="signup-form-buttons">
                                <button className="signup-form-submit-btn" type="submit">Sign Up</button>
                                <h2 className="signup-form-or">or</h2>
                                <button onClick={handleGoogleSignUp} className="signup-form-google-btn"><i className="fa-brands fa-google"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
