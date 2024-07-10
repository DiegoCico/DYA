import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../css/LogIn.css';

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const initializeRoadmap = async (uid, email) => {
    await setDoc(doc(db, 'roadmaps', uid), {
      name: email,
      currentLevel: 1
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ensure the roadmap document exists
      const docRef = doc(db, 'roadmaps', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        // Create a new roadmap document if it doesn't exist
        await initializeRoadmap(user.uid, email);
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
      </div>
    </div>
  );
}

export default LogIn;
