import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import '../css/App.css';
import LoginPage from './LogIn';
import Signup from './Signup';
import Roadmap from './Roadmap';
import Activity from './Activity';

function App() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <div>
            <header className="App-header">
              <div className="auth-buttons">
                <button className="auth-button" onClick={handleLoginClick}>Log In</button>
                <button className="auth-button" onClick={handleSignupClick}>Sign Up</button>
              </div>
              <h1>Welcome to DYA!</h1>
              <p>Your ultimate fun and learning destination for kids.</p>
            </header>
            <main>
              <section className="hero">
                <h2>Discover and Learn</h2>
                <p>Explore our interactive games, educational videos, and fun activities!</p>
                <button className="animated-button">Get Started</button>
              </section>
              <section className="features">
                <div className="feature">
                  <h3>Games</h3>
                  <p>Engage in exciting and educational games designed for kids.</p>
                </div>
                <div className="feature">
                  <h3>Videos</h3>
                  <p>Watch fun and educational videos that keep you entertained.</p>
                </div>
                <div className="feature">
                  <h3>Activities</h3>
                  <p>Participate in creative and fun activities to learn new things.</p>
                </div>
              </section>
            </main>
            <footer>
              <p>&copy; 2024 DYA. All rights reserved.</p>
            </footer>
          </div>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/roadmap/:uid" element={<Roadmap />} />
        <Route path="/activity/:uid/:activityIndex" element={<Activity />} />
      </Routes>
    </div>
  );
}

export default App;
