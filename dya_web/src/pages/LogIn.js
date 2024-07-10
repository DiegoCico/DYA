import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import '../css/LogIn.css';

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const fetchActivities = async () => {
    const activitiesSnapshot = await getDocs(collection(db, 'activities'));
    const activitiesList = activitiesSnapshot.docs.map(doc => doc.data());
    return activitiesList;
  };

  const initializeRoadmap = async (uid, email, activities) => {
    await setDoc(doc(db, 'roadmaps', uid), {
      name: email,
      currentLevel: 1,
      activities: activities
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch activities from Firestore
      const activities = await fetchActivities();

      // Ensure the roadmap document exists and is initialized properly
      const docRef = doc(db, 'roadmaps', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists() || !docSnap.data().activities || docSnap.data().activities.length === 0) {
        // Create a new roadmap document or update the existing one if activities are missing
        await initializeRoadmap(user.uid, email, activities);
      }

      console.log('Login successful');
      navigate(`/roadmap/${user.uid}`); // Redirect to the roadmap page with UID
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('Password reset email sent successfully. Please check your inbox.');
      setResetError('');
    } catch (err) {
      setResetError(err.message || 'Failed to send password reset email. Please try again.');
      setResetMessage('');
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
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          {error && <p className="error-message">{error}</p>}
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
            onChange={(e) => setResetEmail(e.target.value)}
            className="login-input"
          />
          <button onClick={handleResetPassword} className="reset-button">Reset Password</button>
          {resetError && <p className="error-message">{resetError}</p>}
          {resetMessage && <p className="success-message">{resetMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default LogIn;
