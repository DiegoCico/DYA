import React, { useState } from "react";
import '../css/Signup.css';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

/**
 * ChildSignup Component
 * 
 * The `ChildSignup` component handles the sign-up process for children.
 * It supports both email/password sign-up and Google sign-up, and guides the user through multiple steps,
 * including entering personal information and selecting a programming language. The component ensures that 
 * new users are properly initialized in the Firebase database.
 */

const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 12);
};

export default function ChildSignup(props) {
    const { setShowSignUpForm, toggleLoginPopUp } = props;

    const [userId, setUserId] = useState();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    /**
     * handleNext
     * 
     * @description Handles the transition to the next step in the signup process, validating the current step's input.
     * @param {string} lang - The programming language selected by the user (used only in the final step).
     */
    const handleNext = (lang) => {
        if (step === 2 && !name) {
            setError('Please enter your name.');
            return;
        }
        if (step === 3 && !username) {
            setError('Please enter your username.');
            return;
        }
        if (step === 4 && !age) {
            setError('Please enter your age.');
            return;
        }
        if (step < 5) {
            setStep(step + 1);
            setError('');
        } else {
            handleCompleteSignUp(lang);
        }
    };

    /**
     * handlePrev
     * 
     * @description Handles the transition to the previous step in the signup process.
     */
    const handlePrev = () => setStep(step - 1);

    /**
     * initializeUser
     * 
     * @description Initializes a new user in the Firebase Firestore with default values.
     * @param {object} user - The user object obtained after successful signup.
     */
    const initializeUser = async (user) => {
        const uniqueId = generateUniqueId();
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            currentActivity: 0,
            programmingLanguages: [],
            uniqueId: uniqueId,
            isParent: false,
            currentLanguage: 'Python'
        }, { merge: true });
    };

    /**
     * handleSubmit
     * 
     * @description Handles the submission of the email/password signup form. It creates a new user and initializes their data in Firebase Firestore.
     * @param {object} e - The event object.
     */
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

    /**
     * handleCompleteSignUp
     * 
     * @description Completes the signup process by updating the user's data with their selected programming language and personal details.
     * @param {string} language - The programming language selected by the user.
     */
    const handleCompleteSignUp = async (language) => {
        const days = ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const date = new Date();
        try {
            const userDocRef = doc(db, 'users', userId);
            const userDocSnap = await getDoc(userDocRef);
            const userData = userDocSnap.data();

            const existingLanguage = userData.programmingLanguages.find((lang) => lang.langName === language);
            const existingCurrentActivity = existingLanguage ? existingLanguage.currentActivity : 0;
            await setDoc(doc(db, 'users', userId), {
                name,
                username,
                age,
                currentActivity: existingCurrentActivity,
                programmingLanguages: [
                    {
                        langName: language,
                        currentActivity: existingCurrentActivity
                    }
                ],
                currentLanguage: language
            }, { merge: true });

            await setDoc(doc(db, 'userActivity', userId), {
                accountCreated: date.toISOString().split('T')[0],
                uniqueId: userData.uniqueId,
                loginData: [
                    {
                        day: date.toISOString().split('T')[0],
                        xp: 0
                    }
                ]
            });

            console.log('Programming language saved successfully');
            navigate(`/roadmap/${userId}`);
        } catch (error) {
            setError(error.message || 'Failed to save programming language. Please try again.');
        }
    };

    /**
     * handleGoogleSignUp
     * 
     * @description Handles the Google sign-up process, initializing the user in Firebase Firestore if they are new.
     */
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const handleGoogleSignUp = async () => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user;
            
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                await initializeUser(user);
                setUserId(user.uid);
                setName(user.displayName || "");
                setStep(3);
            } else {
                navigate(`/roadmap/${user.uid}`);
            }
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
                            <p>Welcome to our coding platform! We're excited to help you start your journey into programming. Let's begin by creating your account.</p>
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
                        error={error}
                    />
                )}
                {step === 3 && (
                    <InfoStep
                        step={step}
                        type='text'
                        length='15'
                        placeholder='Username'
                        dataValue={username}
                        setDataValue={setUsername}
                        handleNext={handleNext}
                        error={error}
                    />
                )}
                {step === 4 && (
                    <InfoStep
                        step={step}
                        type='number'
                        length='2'
                        placeholder='Age'
                        dataValue={age}
                        setDataValue={setAge}
                        handleNext={handleNext}
                        error={error}
                    />
                )}
                {step === 5 && (
                    <InfoStep
                        step={step}
                        handleNext={handleNext}
                        error={error}
                    />
                )}
            </div>
        </>
    );
}

/**
 * InfoStep Component
 * 
 * The `InfoStep` component is used for displaying input forms for various steps in the signup process,
 * including name, username, and age input. In the final step, it allows the user to choose a programming language.
 * 
 * @param {number} step - The current step in the signup process.
 * @param {string} type - The type of input (text, number, etc.).
 * @param {number} length - The maximum length for the input field.
 * @param {string} placeholder - The placeholder text for the input field.
 * @param {string} dataValue - The value of the input field.
 * @param {function} setDataValue - The function to update the input value.
 * @param {function} handleNext - The function to proceed to the next step.
 * @param {string} error - Any error message to display.
 */
function InfoStep({ step, type, length, placeholder, dataValue, setDataValue, handleNext, error }) {
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
                            maxLength={length}
                            placeholder={placeholder}
                            value={dataValue}
                            onChange={(e) => setDataValue(e.target.value)}
                            required
                        />
                        <button className="signup-form-submit-btn step" onClick={() => handleNext()}>Next</button>
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
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}
