import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import '../css/App.css';
import Roadmap from './Roadmap';
import Activity from './Activity';
import ChildSignup from './ChildSignup';
import ParentSignup from './ParentSignup';
import NewSignup from './NewSignup';
import NewLogin from './NewLogin';
// import AdditionalInfo from './ChildAdditionalInfo';
import SignUpTypePopUp from '../components/SignUpTypePopUp';

function App() {
  const navigate = useNavigate();

  const handleRouteChange = (route) => {
    navigate(route);
  };

  const [ showPopUp, setShowPopUp ] = useState(false)
  const [ showSignUpForm, setShowSignUpForm ] = useState(false)

  const togglePopUp = () => {
    setShowPopUp(!showPopUp)
    setShowSignUpForm(false)
  }

  const toggleSignUpForm = () => {
    setShowSignUpForm(true)
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <div>
            <header className="App-header">
              <div className="auth-buttons">
                <button className="auth-button" onClick={() => handleRouteChange('/login')}>Log In</button>
                {/* <button className="auth-button" onClick={() => handleRouteChange('/signup')}>Sign Up</button> */}
                <button className="auth-button" onClick={togglePopUp}>Sign Up</button>
              </div>
              <h1>Welcome to DYA!</h1>
              <p>Your ultimate fun and learning destination for kids.</p>
            </header>
            <main>
              {showPopUp && (
                <div className='popup-overlay' onClick={togglePopUp}>
                  <div className='popup-content' onClick={(e) => e.stopPropagation()}>
                    {showSignUpForm ? (
                      <ChildSignup setShowSignUpForm={setShowSignUpForm}/>
                    )  : (
                      <SignUpTypePopUp showSignUpForm={toggleSignUpForm} />
                    )}
                  </div>
                </div>
              )}
              <div className={`main-content ${showPopUp ? 'blur' : ''}`}>
                <section className="features">
                  <div className="feature feature-games">
                    <img src="game.jpg" alt="Games" className="feature-image" />
                    <h3>Games</h3>
                    <p>Engage in exciting and educational games designed for kids.</p>
                  </div>
                  <div className="feature feature-videos">
                    <img src="videos.jpg" alt="Videos" className="feature-image" />
                    <h3>Videos</h3>
                    <p>Watch fun and educational videos that keep you entertained.</p>
                  </div>
                  <div className="feature feature-activities">
                    <img src="activities.jpg" alt="Activities" className="feature-image" />
                    <h3>Activities</h3>
                    <p>Participate in creative and fun activities to learn new things.</p>
                  </div>
                </section>
                <section className="hero">
                  <img src='branch-left.png' alt='left-img' className='hero-img-left'/>
                  <div className='hero-content'>
                    <h2>Discover and Learn</h2>
                    <p>Explore our interactive games, educational videos, and fun activities!</p>
                    <button className="animated-button">Get Started</button>
                  </div>
                  <img src='branch-right.png' alt='right-img' className='hero-img-right'/>
                </section>
                <section className="reasons">
                  <h2>Why Join DYA?</h2>
                  <ul>
                    <li>Interactive and engaging content tailored for kids.</li>
                    <li>Educational games and activities that make learning fun.</li>
                    <li>Expert-designed courses to ensure quality education.</li>
                    <li>Special offers and discounts for early sign-ups.</li>
                    <li>Safe and secure online environment for children.</li>
                  </ul>
                </section>
                <section className="sales-info">
                  <h2>Join Our Course Today!</h2>
                  <p>Sign up for our comprehensive courses designed to make learning fun and engaging. Don't miss out on our special offer - enroll now and get a 20% discount!</p>
                  <button className="animated-button" onClick={() => handleRouteChange('/signup')}>Sign Up Now</button>
                </section>
              </div>
            </main>
            <footer>
              <p>&copy; 2024 DYA. All rights reserved.</p>
            </footer>
          </div>
        } />
        <Route path="/login" element={<NewLogin handleRouteChange={handleRouteChange} />} />
        {/* <Route path='/signup' element={<NewSignup handleRouteChange={handleRouteChange} />} /> */}
        <Route path='/signup' element={<SignUpTypePopUp handleRouteChange={handleRouteChange} />} />
        <Route path='/signup/parent' element={<ParentSignup />} />
        <Route path='/signup/child' element={<ChildSignup handleRouteChange={handleRouteChange} />} />
        <Route path="/roadmap/:uid" element={<Roadmap />} />
        <Route path="/activity/:uid/:activityIndex" element={<Activity />} />
        {/* <Route path="/signupInfo/:userId/:startingStep" element={<AdditionalInfo />} /> */}
      </Routes>
    </div>
  );
}

export default App;
