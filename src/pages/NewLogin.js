import React, { useState } from "react";
import Header from "../components/Header";
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore'
import '../css/Signup.css';

export default function NewLogin(props) {
    const { handleRouteChange, toggleSignUpPopUp, toggleLoginPopUp } = props

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState()

    const handleSubmit = async(e) => {
        e.preventDefault()

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) {
                setError('User does not exist, create a new account')
            }

            handleRouteChange(`/roadmap/${user.uid}`)
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.')
        }
    }

    const handleGoogleSignIn = async() => {
        const googleProvider = new GoogleAuthProvider()
        try {
            const res = await signInWithPopup(auth, googleProvider)
            const user = res.user
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists) {
                console.log('Create account')
            }
            handleRouteChange(`roadmap/${user.uid}`)
        } catch (error) {

        }
    }

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
                        toggleLoginPopUp()
                        toggleSignUpPopUp()
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
        </div>
    )
}