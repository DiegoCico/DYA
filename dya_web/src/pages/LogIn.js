import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../css/LogIn.css';

const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 12);
};

function LogIn() {
  const [email, setEmail] = useState(''); // State to store email input
  const [password, setPassword] = useState(''); // State to store password input
  const [resetEmail, setResetEmail] = useState(''); // State to store reset email input
  const [error, setError] = useState(''); // State to handle login errors
  const [resetError, setResetError] = useState(''); // State to handle reset errors
  const [resetMessage, setResetMessage] = useState(''); // State to store reset message
  const navigate = useNavigate(); // Navigation hook

  // Initialize user data for a new user
  const initializeUser = async (uid, email) => {
    const nameAndUsername = email.split('@')[0];
    const uniqueId = generateUniqueId();
    await setDoc(doc(db, 'users', uid), {
      email: email,
      currentActivity: 1,
      programmingLanguages: ["Python"],
      name: nameAndUsername,
      username: nameAndUsername,
      uniqueId: uniqueId
    });
  };

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ensure the user document exists and is initialized properly
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
      navigate(`/roadmap/${user.uid}`); // Redirect to the roadmap page with UID
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.'); // Set error message
    }
  };

  const handleBackClick = () => {
    navigate('/'); // Navigate back to the home page
  };

  const handleSignupClick = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  // Handle password reset
  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('Password reset email sent successfully. Please check your inbox.'); // Set success message
      setResetError(''); // Clear reset error
    } catch (err) {
      setResetError(err.message || 'Failed to send password reset email. Please try again.'); // Set error message
      setResetMessage(''); // Clear success message
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email input
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password input
            required
            className="login-input"
          />
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
          <button type="submit" className="login-button">Log In</button>
        </form>
        <button onClick={handleBackClick} className="back-button">Back</button>
        <p>Don't have an account? <button onClick={handleSignupClick} className="switch-button">Sign Up</button></p>
        <div className="forgot-password-section">
          <h3>Forgot Password?</h3>
          <input
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)} // Update reset email input
            className="login-input"
          />
          <button onClick={handleResetPassword} className="reset-button">Reset Password</button>
          {resetError && <p className="error-message">{resetError}</p>} {/* Display reset error message */}
          {resetMessage && <p className="success-message">{resetMessage}</p>} {/* Display reset success message */}
        </div>
      </div>
    </div>
  );
}

export default LogIn;
