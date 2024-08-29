import React, { useState } from "react";
import '../css/Signup.css';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

/**
 * Generates a unique ID for the user.
 * @returns {string} - A random unique ID string.
 */
const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 12);
};

/**
 * ParentSignup Component
 * 
 * The `ParentSignup` component handles the sign-up process for parents.
 * It allows parents to sign up using an email and password or through Google authentication.
 * Parents can also add their children's unique IDs during the sign-up process.
 */

export default function ParentSignup(props) {
    const { setShowSignUpForm, toggleLoginPopUp } = props;

    const [userId, setUserId] = useState();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [tempChildren, setTempChildren] = useState([]); // Temporarily stores children's IDs
    const [childID, setChildID] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    /**
     * handleNext
     * 
     * @description Handles the transition to the next step in the signup process,
     * including validation and adding child IDs if provided.
     */
    const handleNext = async () => {
        if (step === 2 && !name) {
            setError('Please enter your name.');
            return;
        }
        if (step === 3 && !age) {
            setError('Please enter your age.');
            return;
        }
        if (step === 4 && childID) {
            const isValidChildID = await checkChildIDExists(childID);
            if (!isValidChildID) {
                setError('Invalid child ID. Please enter a valid child ID.');
                return;
            }
            addChild(); 
        }
        if (step < 4) {
            setStep(step + 1);
            setError('');
        } else {
            handleCompleteSignUp();
        }
    };

    /**
     * handlePrev
     * 
     * @description Handles the transition to the previous step in the signup process.
     */
    const handlePrev = () => setStep(step - 1);

    /**
     * checkChildIDExists
     * 
     * @description Checks if the provided child ID exists in the database.
     * @param {string} childID - The unique ID of the child to check.
     * @returns {boolean} - Returns true if the child ID exists, otherwise false.
     */
    const checkChildIDExists = async (childID) => {
        const q = query(collection(db, "users"), where("uniqueId", "==", childID));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    /**
     * initializeUser
     * 
     * @description Initializes the parent user data in the Firestore database.
     * @param {string} id - The unique ID of the user.
     * @param {Array} children - An array of children's unique IDs associated with the parent.
     */
    const initializeUser = async (id, children) => {
        const uniqueId = generateUniqueId();
        await setDoc(doc(db, 'parents', id), {
            email: email,
            name: name,
            age: age,
            children: children,
            uniqueId: uniqueId,
            isParent: true 
        }, { merge: true });
    };

    /**
     * handleSubmit
     * 
     * @description Handles the submission of the signup form using email and password.
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
     * addChild
     * 
     * @description Adds a valid child ID to the temporary list of children IDs.
     */
    const addChild = async () => {
        if (!tempChildren.includes(childID)) {
            const isValidChildID = await checkChildIDExists(childID);
            if (!isValidChildID) {
                setError('Invalid child ID. Please enter a valid child ID.');
                return;
            }
            setTempChildren([...tempChildren, childID]);
            setChildID('');
            setError('Child added successfully');
        } else {
            setError('Child already added');
        }
    };

    /**
     * handleCompleteSignUp
     * 
     * @description Completes the signup process by saving the parent and children data in Firestore and navigating to the parent hub.
     */
    const handleCompleteSignUp = async () => {
        if (tempChildren.length > 0) {
            console.log(tempChildren);
            await initializeUser(userId, tempChildren);
            navigate(`/parenthub/${userId}`);
        } else {
            setError('Add at least one child');
        }
    };

    /**
     * handleGoogleSignUp
     * 
     * @description Handles the signup process using Google authentication.
     */
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const handleGoogleSignUp = async () => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user;
            console.log(user.displayName);
            setUserId(user.uid);
            setName(user.displayName || "");
            setEmail(user.email);
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
                        tempChildren={tempChildren}
                        addChild={addChild}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
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
 * including name, age, and child ID input. It also allows parents to add multiple child IDs.
 * 
 * @param {number} step - The current step in the signup process.
 * @param {string} type - The type of input (text, number, etc.).
 * @param {number} length - The maximum length for the input field.
 * @param {string} placeholder - The placeholder text for the input field.
 * @param {string} dataValue - The value of the input field.
 * @param {function} setDataValue - The function to update the input value.
 * @param {function} addChild - The function to add a child ID to the temporary list (used in step 4).
 * @param {function} handleNext - The function to proceed to the next step.
 * @param {function} handlePrev - The function to go back to the previous step.
 * @param {string} error - Any error message to display.
 */
function InfoStep({ step, type, length, placeholder, dataValue, setDataValue, addChild, handleNext, handlePrev, error }) {
    return (
        <div className="main-container info">
            <div className="parent-signup-container">
                <div className="title">
                    <h1>Almost there</h1>
                </div>
                <div className="info-input-container">
                    <input
                        className="info-input"
                        type={type}
                        maxLength={length}
                        placeholder={placeholder}
                        value={dataValue}
                        onChange={(e) => setDataValue(e.target.value)}
                        required
                    />
                    {step === 4 && (
                        <button className="add-child-button" onClick={addChild}>+</button>
                    )}
                </div>
                <div className="signup-form-buttons">
                    {step > 1 && <button className="signup-form-submit-btn step" onClick={handlePrev}>Back</button>}
                    <button className="signup-form-submit-btn step" onClick={handleNext}>Next</button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}
