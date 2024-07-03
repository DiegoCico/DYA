import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';

// TODO: FIX THIS AND CONFIGURE THE FIREBASE
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBI37lzWhWSv7VQif5mlNbZm0Bso5W05OA",
//   authDomain: "dyakidswebsite-ab5f1.firebaseapp.com",
//   projectId: "dyakidswebsite-ab5f1",
//   storageBucket: "dyakidswebsite-ab5f1.appspot.com",
//   messagingSenderId: "79577052767",
//   appId: "1:79577052767:web:c68ca99c2a73b59f5ecdea",
//   measurementId: "G-Y106TTN34Y"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
