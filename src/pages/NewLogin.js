import React, { useState } from "react";
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import '../css/Signup.css';

// class LoginQueue {
//     constructor(maxDays, days) {
//         this.queue = days
//         this.maxDays = maxDays
//     }
//     addDay(day) {
//         if (this.queue.length === this.maxDays) {
//             this.queue.shift()
//         }
//         this.queue.push(day)
//     }
//     fillMissedDays(todayIndex, prevIndex, weekdays) {
//         const existingDays = new Set(this.queue.map(day => day.day))

//         for (let i = prevIndex; i<=todayIndex; i++) {
//             const day = weekdays[i]
//             console.log('i', i)
            
//             if (!existingDays.has(day)) {
//                 console.log('adding missed day', day)
//                 this.addDay({day: day, xp: 0})
//             }
//         }
//         console.log('Finished adding missed days')
//         console.log('Queue before sorting', this.queue)
//         this.queue.sort((a, b) => weekdays.indexOf(a.day) - weekdays.indexOf(b.day));
//     }
//     getDays() {
//         return this.queue
//     }
// }

export default function NewLogin(props) {
    const { handleRouteChange, toggleSignUpPopUp, toggleLoginPopUp } = props;
    let days = ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const [showGoogleErrorPopup, setShowGoogleErrorPopup] = useState(false);
    const date = new Date()

    const getUpdatedDays = (day, dayOne) => {
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday']

        const date = new Date()
        const todayIndex = days.indexOf(day)
        let xLabel = []
        if (dayOne) {
            xLabel = days.slice(todayIndex).concat(days.slice(0, todayIndex))
        } else {
            // current day all the way on the right side, to the left --> rest of the week
            xLabel = days.slice(todayIndex+1).concat(days.slice(0, todayIndex+1))
        }

        // console.log(xLabel)
        return xLabel
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                alert('User does not exist, please sign up!');
                toggleLoginPopUp(); // Close the login popup
                setTimeout(() => {
                    toggleSignUpPopUp(); // Open the signup popup
                }, 300); 
                return;
            }

            const userData = docSnap.data();
            if (userData.isParent) {
                handleRouteChange(`/parenthub/${user.uid}`);
            } else {
                handleRouteChange(`/roadmap/${user.uid}`)
            }
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.');
        }
    };

    async function updateUserLoginData(userID, newLoginDay, newXP) {
        const userActivityDocRef = doc(db, 'userActivity', userID)
        const docSnap = await getDoc(userActivityDocRef)
        let userLogInData = docSnap.data().loginData || []

        userLogInData.sort((a,b) => new Date(a.day) - new Date(b.day))

        if (userLogInData.length > 0) {
            const lastLoginDate = userLogInData[userLogInData.length - 1].day
            userLogInData = fillMissedDays(userLogInData, lastLoginDate, newLoginDay)
        }

        userLogInData.push({ day: newLoginDay, xp: newXP })

        if (userLogInData.length > 7) {
            userLogInData = userLogInData.slice(-7)
        }

        await updateDoc(userActivityDocRef, {
            loginData: userLogInData
        })
    }

    function fillMissedDays(userLoginData, lastLoginDate, newLoginDay) {
        const currentDate = new Date(lastLoginDate)
        const targetDate = new Date(newLoginDay)

        while (currentDate < targetDate) {
            currentDate.setDate(currentDate.getDate() + 1)
            const nextDate = currentDate.toISOString().split('T')[0]

            if (nextDate !== newLoginDay) {
                console.log('Adding missing day', nextDate)
                userLoginData.push({ day: nextDate, xp: 0 })
            }

            if (userLoginData.length > 7) {
                userLoginData.shift()
            }
        }

        return userLoginData
    }

    const handleGoogleSignIn = async () => {
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({ prompt: 'select_account' });
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user;
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            const parentDocRef = doc(db, 'parents', user.uid);
            const parentDocSnap = await getDoc(parentDocRef);
            
            if (!userDocSnap.exists() && !parentDocSnap.exists()) {
                setShowSignUpForm(true);
                setShowGoogleErrorPopup(true);
                toggleLoginPopUp(); 
                setTimeout(() => {
                    toggleSignUpPopUp(); // Open the signup popup
                }, 300); // Adding a delay to ensure the login popup fully closes before opening signup
            } else {
                let fetchedData;
                if (parentDocSnap.exists()) {
                    fetchedData = parentDocSnap.data();
                } else if (userDocSnap.exists()) {
                    fetchedData = userDocSnap.data();
                }

                if (fetchedData.isParent) {
                    handleRouteChange(`/parenthub/${user.uid}`);
                } else {
                    handleRouteChange(`/roadmap/${user.uid}`);
                    const userActivityDocRef = doc(db, 'userActivity', user.uid)
                    const docSnap = await getDoc(userActivityDocRef)
                    let userLogInData = docSnap.data().loginData || []
                    // get today date in YYYY-MM-DD format
                    const today = date.toISOString().split('T')[0]
                    const lastLoginDay = userLogInData[userLogInData.length-1]
                    // const testDay = '2024-08-20' // for testing
                    if (today !== lastLoginDay) {
                        console.log('New login on', today)
                        updateUserLoginData(user.uid, today, 0)
                    } else {
                        console.log('User already logged in today')
                    }
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
                        <h2 className="signup-form-or">or</h2>
                        <button onClick={handleGoogleSignIn} className="signup-form-google-btn"><i className="fa-brands fa-google"></i>Continue with Google</button>
                    </div>
                </form>
            </div>
            {showGoogleErrorPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Account Not Found</h3>
                        <p>No account found with the provided Google credentials. Please sign up.</p>
                        <button onClick={() => setShowGoogleErrorPopup(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}