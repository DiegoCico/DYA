// import React, { useState } from 'react';
// import { auth, db } from '../firebase';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import '../css/Signup.css';

// function Signup() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setError('Passwords do not match. Please try again.');
//       return;
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Create a roadmap document for the new user
//       await setDoc(doc(db, 'roadmaps', user.uid), {
//         name: email,
//         currentLevel: 1,
//         activities: activities // Use imported activities
//       });

//       console.log('Signup successful');
//       navigate(`/roadmap/${user.uid}`); // Redirect to the roadmap page with UID
//     } catch (err) {
//       setError(err.message || 'Signup failed. Please try again.');
//     }
//   };

//   const handleBackClick = () => {
//     navigate('/');
//   };

//   const handleLoginClick = () => {
//     navigate('/login');
//   };

//   return (
//     <div className="signup-page">
//       <div className="signup-container">
//         <h2>Sign Up</h2>
//         <form onSubmit={handleSubmit} className="signup-form">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="signup-input"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="signup-input"
//           />
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//             className="signup-input"
//           />
//           {error && <p className="error-message">{error}</p>}
//           <button type="submit" className="signup-button">Sign Up</button>
//         </form>
//         <button onClick={handleBackClick} className="back-button">Back</button>
//         <p>Already have an account? <button onClick={handleLoginClick} className="switch-button">Log In</button></p>
//       </div>
//     </div>
//   );
// }

// export default Signup;
