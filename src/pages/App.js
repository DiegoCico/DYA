import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import '../css/App.css';
import Roadmap from './Roadmap';
import Activity from './Activity';
import ChildSignup from './ChildSignup';
import NewLogin from './NewLogin';
import SignUpTypePopUp from '../components/SignUpTypePopUp';
import Footer from '../components/Footer';
import LanguageSlider from '../components/LanguageSlider';
import MascotSection from '../components/MascotSection';
import Lessons from "./Lessons";
import ParentHub from "./ParentHub"

function App() {
  const navigate = useNavigate();

  const handleRouteChange = (route) => {
    if (route) {
      navigate(route);
    } else {
      console.error("Undefined route passed to handleRouteChange");
    }
  };

  const [showSignUpPopUp, setShowSignUpPopUp] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showLoginPopUp, setShowLoginPopUp] = useState(false);

  useEffect(() => {
    setShowSignUpPopUp(false);
    setShowSignUpForm(false);
    setShowLoginPopUp(false);
  }, [navigate]);

  const toggleSignUpPopUp = () => {
    setShowSignUpPopUp(!showSignUpPopUp);
    setShowSignUpForm(false);
    setShowLoginPopUp(false);
  };

  const toggleSignUpForm = () => {
    setShowSignUpForm(true);
  };

  const toggleLoginPopUp = () => {
    setShowSignUpPopUp(false);
    setShowLoginPopUp(!showLoginPopUp);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <div>
            <header className="App-header">
              <div className="auth-buttons">
                <button className="auth-button" onClick={toggleLoginPopUp}>Log In</button>
                <button className="auth-button" onClick={toggleSignUpPopUp}>Sign Up</button>
              </div>
              <h1>Welcome to DYA!</h1>
              <p>Your ultimate fun and learning destination for kids.</p>
            </header>
            <main>
              {showSignUpPopUp && (
                <div className='popup-overlay' onClick={() => setShowSignUpPopUp(false)}>
                  <div className='popup-content' onClick={(e) => e.stopPropagation()}>
                    {showSignUpForm ? (
                      <ChildSignup
                        setShowSignUpForm={setShowSignUpForm}
                        toggleLoginPopUp={toggleLoginPopUp}
                      />
                    ) : (
                      <SignUpTypePopUp
                        showSignUpForm={toggleSignUpForm}
                        handleRouteChange={handleRouteChange}
                        toggleLoginPopUp={toggleLoginPopUp}
                      />
                    )}
                  </div>
                </div>
              )}
                
              {showLoginPopUp && (
                <div className='popup-overlay' onClick={() => setShowLoginPopUp(false)}>
                  <div className='popup-content' onClick={(e) => e.stopPropagation()}>
                    <NewLogin
                      handleRouteChange={handleRouteChange}
                      toggleSignUpPopUp={toggleSignUpPopUp}
                      toggleLoginPopUp={toggleLoginPopUp}
                    />
                  </div>
                </div>
              )}
              <div className={`main-content ${showSignUpPopUp || showLoginPopUp ? 'blur' : ''}`}>
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
        <Route path='/signup/child' element={<ChildSignup handleRouteChange={handleRouteChange} />} />
        <Route path="/parenthub/:userId" element={<ParentHub />} />
        <Route path="/roadmap/:uid" element={<Roadmap />} />
        <Route path="/activity/:uid/:activityTitle/:activityOrder" element={<Activity />} />
        <Route path="/lessons/:uid/:language/:lessonTitle" element={<Lessons />} />
      </Routes>
    </div>
  );
}

export default App;
