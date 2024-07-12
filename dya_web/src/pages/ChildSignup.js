import React, { useState } from "react";
import '../css/Signup.css';
import Header from '../components/Header';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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

    const initializeUser = async (uid, email) => {
        const uniqueId = generateUniqueId();
        await setDoc(doc(db, 'users', uid), {
            email: email,
            currentActivity: 1,
            programmingLanguages: ["Python"],
            uniqueId: uniqueId
        });
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

            await initializeUser(user.uid, email);

            console.log('Signup successful', user.uid);
            navigate(`/signupInfo/${user.uid}`); // Navigate to additional info page

        } catch (error) {
            setError(error.message || 'Signup failed. Please try again.');
        }
    };

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
                        <button className="signup-btn" type="submit">Sign Up</button>
                    </form>
                    <div className="signin-container">
                        <p>Already joined?</p>
                        <button
                            className="signin-button"
                            onClick={() => navigate('/login')}
                        >
                            Log In
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
