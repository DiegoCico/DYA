import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import '../css/App.css';
import LoginPage from './LogIn';
// import Signup from './Signup';
import Roadmap from './Roadmap';
import Activity from './Activity';
import ChildSignup from './ChildSignup';
import ParentSignup from './ParentSignup';
import NewSignup from './NewSignup';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import activitiesData from '../activities.json'; // Import the JSON file

const initializeRoadmaps = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'roadmaps'));
    if (querySnapshot.empty) {
      // If the collection is empty, add the initial activities data
      const docRef = doc(db, 'roadmaps', 'default_roadmap');
      await setDoc(docRef, activitiesData);
      console.log('Initialized roadmaps collection with activities data.');
    } else {
      console.log('Roadmaps collection already initialized.');
    }
  } catch (error) {
    console.error('Error initializing roadmaps collection:', error);
  }
};

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    initializeRoadmaps();
  }, []);

  const handleRouteChange = (route) => {
    navigate(route);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <div>
            <header className="App-header">
              <div className="auth-buttons">
                <button className="auth-button" onClick={() => handleRouteChange('/login')}>Log In</button>
                <button className="auth-button" onClick={() => handleRouteChange('/signup')}>Sign Up</button>
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
            </main>
            <footer>
              <p>&copy; 2024 DYA. All rights reserved.</p>
            </footer>
          </div>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<NewSignup handleRouteChange={handleRouteChange} />} />
        <Route path='/signup/parent' element={<ParentSignup />} />
        <Route path='/signup/child' element={<ChildSignup handleRouteChange={handleRouteChange} />} />
        <Route path="/roadmap/:uid" element={<Roadmap />} />
        <Route path="/activity/:uid/:activityIndex" element={<Activity />} />
      </Routes>
    </div>
  );
}

export default App;
