import React, { useState } from "react";
import '../css/Signup.css';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 12);
};

export default function ChildSignup(props) {
    const { setShowSignUpForm } = props

    const [userId, setUserId] = useState()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [step, setStep] = useState(1)
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [age, setAge] = useState('')
    const [programmingLanguage, setProgrammingLanguage] = useState('')
    const [error, setError] = useState('')

    const handleNext = () => setStep(step + 1)
    const handlePrev = () => setStep(step - 1)

    const navigate = useNavigate()

    const initializeUser = async (user) => {
        const uniqueId = generateUniqueId();
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                currentActivity: 1,
                programmingLanguages: ["Python"],
                uniqueId: uniqueId
            })
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
            // navigate(`/signupInfo/${user.uid}/1`); // Navigate to additional info page
            setUserId(user.uid)
            // setShowSignUpForm(false)
            
            handleNext()
            
        } catch (error) {
            setError(error.message || 'Signup failed. Please try again.');
        }
    };

    const handleCompleteSignUp = async (language) => {
        try {
            await setDoc(doc(db, 'users', userId), {
                name,
                username,
                age,
                programmingLanguages: [language]
            }, { merge: true });

            console.log('Programming language saved successfully');
            navigate(`/roadmap/${userId}`); // Redirect to the roadmap page
        } catch (error) {
            setError(error.message || 'Failed to save programming language. Please try again.');
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
                                    <button className="signup-form-submit-btn" type="submit" onClick={handleSubmit}>Sign Up</button>
                                    <h2 className="signup-form-or">or</h2>
                                    <button onClick={handleGoogleSignUp} className="signup-form-google-btn"><i className="fa-brands fa-google"></i>Continue with Google</button>
                                    <button className="signup-form-submit-btn" onClick={handleNext}>Next</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <InfoStep
                        step={step}
                        type='text'
                        placeholder='Name'
                        dataValue={name}
                        setDataValue={setName}
                        handleNext={handleNext}
                    />
                )}
                {step === 3 && (
                    <InfoStep
                        step={step}
                        type='text'
                        placeholder='Username'
                        dataValue={username}
                        setDataValue={setUsername}
                        handleNext={handleNext}
                    />
                )}
                {step === 4 && (
                    <InfoStep
                        step={step}
                        type='number'
                        placeholder='Age'
                        dataValue={age}
                        setDataValue={setAge}
                        handleNext={handleNext}
                    />
                )}
                {step === 5 && (
                    <InfoStep
                        step={step}
                        handleNext={handleCompleteSignUp}
                    />
                )}
            </div>
        </>
    );
}

function InfoStep({ step, type, placeholder, dataValue, setDataValue, handleNext }) {
    return (
        <div className="main-container info">
            <div className="child-signup-container info">
                <div className="title">
                    <h1>Almost there</h1>
                </div>
                {step < 5 && (
                    <>
                        <input
                            className="info-input"
                            type={type}
                            placeholder={placeholder}
                            value={dataValue}
                            onChange={(e) => setDataValue(e.target.value)}
                            required
                        />
                        <button className="signup-form-submit-btn step" onClick={handleNext}>Next</button>
                    </>
                )}
                {step === 5 && (
                    <>
                        <p>Select a Fun Programming Language</p>
                        <div className="lang-selection-container">
                            <button
                                type="button"
                                onClick={() => handleNext('HTML/CSS')}
                            >
                                <span>&#8226;</span> HTML/CSS: Create Beautiful Websites!
                            </button>
                            <button
                                type="button"
                                onClick={() => handleNext('Java')}
                            >
                                <span>&#8226;</span> Java: Build Amazing Apps!
                            </button>
                            <button
                                type="button"
                                onClick={() => handleNext('Python')}
                            >
                                <span>&#8226;</span> Python: Code Like a Pro!
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
