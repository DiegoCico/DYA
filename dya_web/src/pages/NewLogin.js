import React, { useState } from "react";
import Header from "../components/Header";
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore'
import '../css/NewLogin.css';

export default function NewLogin(props) {
    const generateUniqueId = () => {
        return Math.random().toString(36).substring(2, 12)
    }

    const { handleRouteChange } = props

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState()

    const initializeUser = async (uid, email) => {
        const nameAndUsername = email.split('@')[0]
        const uniqueId = generateUniqueId()
        await setDoc(doc(db, 'users', uid), {
            email: email,
            currentActivity: 1,
            programmingLanguages: ["Python"],
            name: nameAndUsername,
            username: nameAndUsername,
            uniqueId: uniqueId
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                // Create a new user document
                await initializeUser(user.uid, email);
            } else {
                // Check if uniqueId, name, and username are missing and set them if necessary
                const userData = docSnap.data();
                const updates = {};
                if (!userData.uniqueId) {
                updates.uniqueId = generateUniqueId();
                }
                if (!userData.name) {
                updates.name = email.split('@')[0];
                }
                if (!userData.username) {
                updates.username = email.split('@')[0];
                }
                if (Object.keys(updates).length > 0) {
                await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
                }
            }

        console.log('Login successful');
        handleRouteChange(`/roadmap/${user.uid}`)
        } catch (err) {
        setError(err.message || 'Login failed. Please try again.'); // Set error message
        }
    }

    return (
        <div className="login-page">
            <div className="header-container">
                <Header />
            </div>
            <div className="login-main-content">
                <div className="login-left">
                    <h2 className="login-container-title">Let's get back to it!</h2>
                    <div className="login-container">
                        <div className="login-signup-container">
                            <h3>New? Join us!</h3>
                            <button className="login-signup-btn" onClick={() => handleRouteChange('/signup')}>Sign Up</button>
                        </div>
                        <div className="login-form-container">
                            <form onSubmit={handleSubmit}>
                                <input type="email" className="login-form-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                                <input className="login-form-input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                                {error && <p className="error-message">{error}</p>}
                                <div className="login-form-buttons">
                                    <button type="submit" className="login-form-submit-btn">Login</button>
                                    <h2 className="login-form-or">or</h2>
                                    <button className="login-form-google-btn"><i className="fa-brands fa-google"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="login-right">
                    <h2>Image goes here</h2>
                </div>
            </div>
        </div>
    )
}