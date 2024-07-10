import React, { useState } from "react";
import '../css/Signup.css';
import Header from "../components/Header";
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function ChildSignup(props) {
    const { handleRouteChange } = props;
    const [email, setEmail] = useState(''); // State to store email input
    const [password, setPassword] = useState(''); // State to store password input
    const [confirmPassword, setConfirmPassword] = useState(''); // State to store confirm password input
    const [error, setError] = useState(''); // State to handle errors
    const navigate = useNavigate(); // Navigation hook

    // Fetch activities from Firestore
    const fetchActivities = async () => {
        const activitiesSnapshot = await getDocs(collection(db, 'activities'));
        const activitiesList = activitiesSnapshot.docs.map(doc => doc.data());
        return activitiesList;
    };

    // Handle form submission for signup
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords need to match!'); // Set error message if passwords do not match
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch activities from Firestore
            const activities = await fetchActivities();

            // Create a roadmap document for the new user
            await setDoc(doc(db, 'roadmaps', user.uid), {
                name: email,
                currentLevel: 1,
                activities: activities
            });

            console.log('Signup successful');
            navigate(`/roadmap/${user.uid}`); // Redirect to the roadmap page with UID

        } catch (error) {
            setError(error.message || 'Signup failed. Please try again.'); // Set error message
        }
    };

    return (
        <>
            <Header />
            <div className="child-main-container">
                <div className="left-container">
                    <p>Child account description.</p> {/* Placeholder for child account description */}
                    <p>Image of a kid coding</p> {/* Placeholder for an image */}
                </div>
                <div className="right-container">
                    <h1>Get started learning!</h1>
                    <form onSubmit={handleSubmit}>
                        <input 
                            className="signup-input" 
                            type="email" 
                            placeholder="Your Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} // Update email input
                            required
                        />
                        <input 
                            className="signup-input" 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} // Update password input
                            required
                        />
                        <input 
                            className="signup-input" 
                            type="password" 
                            placeholder="Confirm Password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password input
                            required
                        />
                        {error && <p>{error}</p>} {/* Display error message */}
                        <button className="signup-btn" type="submit">Sign Up</button>
                    </form>
                    <div className="signin-container">
                        <p>Already joined?</p>
                        <button 
                            className="signin-button" 
                            onClick={() => handleRouteChange('/login')}
                        >
                            Log In
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
