import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import '../css/App.css';
import Roadmap from './Roadmap';
import Activity from './Activity';
import ChildSignup from './ChildSignup';
import ParentSignup from './ParentSignup';
import NewSignup from './NewSignup';
import NewLogin from './NewLogin';
import SignUpTypePopUp from '../components/SignUpTypePopUp';
import Footer from '../components/Footer';
import LanguageSlider from '../components/LanguageSlider';
import MascotSection from '../components/MascotSection';

function App() {
  const navigate = useNavigate();

  const handleRouteChange = (route) => {
    if (route) {
      navigate(route);
    } else {
      console.error("Undefined route passed to handleRouteChange");
    }
  };

  const [showPopUp, setShowPopUp] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
    setShowSignUpForm(false);
  };

  const toggleSignUpForm = () => {
    setShowSignUpForm(true);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <div>
            <header className="App-header">
              <div className="auth-buttons">
                <button className="auth-button" onClick={() => handleRouteChange('/login')}>Log In</button>
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
                      <ChildSignup setShowSignUpForm={setShowSignUpForm} />
                    ) : (
                      <SignUpTypePopUp showSignUpForm={toggleSignUpForm} />
                    )}
                  </div>
                </div>
              )}
              <div className={`main-content ${showPopUp ? 'blur' : ''}`}>
                <section className="features">
                  <div className="feature feature-games">
                    <h3>Games</h3>
                    <p>Engage in exciting and educational games designed for kids.</p>
                  </div>
                  <div className="feature feature-videos">
                    <h3>Videos</h3>
                    <p>Watch fun and educational videos that keep you entertained.</p>
                  </div>
                  <div className="feature feature-activities">
                    <h3>Activities</h3>
                    <p>Participate in creative and fun activities to learn new things.</p>
                  </div>
                </section>

                <MascotSection />

                <LanguageSlider />

              </div>
            </main>
            <Footer />
          </div>
        } />
        <Route path="/login" element={<NewLogin handleRouteChange={handleRouteChange} />} />
        <Route path='/signup' element={<SignUpTypePopUp handleRouteChange={handleRouteChange} />} />
        <Route path='/signup/parent' element={<ParentSignup />} />
        <Route path='/signup/child' element={<ChildSignup handleRouteChange={handleRouteChange} />} />
        <Route path="/roadmap/:uid" element={<Roadmap />} />
        <Route path="/activity/:uid/:activityTitle/:activityOrder" element={<Activity />} />
      </Routes>
    </div>
  );
}

export default App;
