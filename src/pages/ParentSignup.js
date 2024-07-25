import React, { useState } from "react";
import '../css/Signup.css';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 12);
};

export default function ParentSignup(props) {
    const { setShowSignUpForm, toggleLoginPopUp } = props;

    const [userId, setUserId] = useState();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [childID, setChildID] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleNext = async () => {
        if (step === 2 && !name) {
            setError('Please enter your name.');
            return;
        }
        if (step === 3 && !age) {
            setError('Please enter your age.');
            return;
        }
        if (step === 4 && !childID) {
            setError('Please enter a valid child ID.');
            return;
        }
        if (step === 4) {
            const isValidChildID = await checkChildIDExists(childID);
            if (!isValidChildID) {
                setError('Invalid child ID. Please enter a valid child ID.');
                return;
            }
        }
        if (step < 4) {
            setStep(step + 1);
            setError('');
        } else {
            handleCompleteSignUp();
        }
    };

    const handlePrev = () => setStep(step - 1);

    const checkChildIDExists = async (childID) => {
        const q = query(collection(db, "users"), where("uniqueId", "==", childID));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const initializeUser = async (user) => {
        const uniqueId = generateUniqueId();
        await setDoc(doc(db, 'parents', user.uid), {
            email: user.email,
            name: name,
            age: age,
            childID: childID,
            uniqueId: uniqueId,
            isParent: true 
        }, { merge: true });
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

            await initializeUser(user);

            console.log('Signup successful', user.uid);
            setUserId(user.uid);
            
            handleNext();
            
        } catch (error) {
            setError(error.message || 'Signup failed. Please try again.');
        }
    };

    const handleCompleteSignUp = async () => {
        navigate(`/parenthub/${userId}`);
    };

    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const handleGoogleSignUp = async() => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user;
            
            await initializeUser(user);
            setUserId(user.uid);
            setName(user.displayName || "");
            setStep(3);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <div className="main-container">
                {step === 1 && (
                    <div className="child-signup-container">
                        <div className="title">
                            <h1>Let's get started</h1>
                        </div>
                        <div className="signup-login-container">
                            <h3>Already joined?</h3>
                            <button
                                className="signin-button"
                                onClick={() => {
                                    setShowSignUpForm(false);
                                    toggleLoginPopUp();
                                }}
                            >Log In</button>
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
                                {error && <p className="error-message">{error}</p>}
                                <div className="signup-form-buttons">
                                    <button className="signup-form-submit-btn" type="submit">Sign Up</button>
                                    <h2 className="signup-form-or">or</h2>
                                    <button onClick={handleGoogleSignUp} className="signup-form-google-btn"><i className="fa-brands fa-google"></i>Continue with Google</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <InfoStep
                        step={step}
                        type='text'
                        length='30'
                        placeholder='Name'
                        dataValue={name}
                        setDataValue={setName}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        error={error}
                    />
                )}
                {step === 3 && (
                    <InfoStep
                        step={step}
                        type='number'
                        length='2'
                        placeholder='Age'
                        dataValue={age}
                        setDataValue={setAge}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        error={error}
                    />
                )}
                {step === 4 && (
                    <InfoStep
                        step={step}
                        type='text'
                        length='30'
                        placeholder='Child ID'
                        dataValue={childID}
                        setDataValue={setChildID}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        error={error}
                    />
                )}
            </div>
        </>
    );
}

function InfoStep({ step, type, length, placeholder, dataValue, setDataValue, handleNext, handlePrev, error }) {
    return (
        <div className="main-container info">
            <div className="parent-signup-container info">
                <div className="title">
                    <h1>Almost there</h1>
                </div>
                <input
                    className="info-input"
                    type={type}
                    maxLength={length}
                    placeholder={placeholder}
                    value={dataValue}
                    onChange={(e) => setDataValue(e.target.value)}
                    required
                />
                <div className="signup-form-buttons">
                    {step > 1 && <button className="signup-form-submit-btn step" onClick={handlePrev}>Back</button>}
                    <button className="signup-form-submit-btn step" onClick={handleNext}>Next</button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}
