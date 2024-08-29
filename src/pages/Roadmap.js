import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import '../css/Roadmap.css';
import UserProfileSidebar from '../components/UserProfileSidebar';
import LanguageDropdown from '../components/LanguageDropdown';

/**
 * Roadmap Component
 * 
 * The `Roadmap` component displays a user's learning roadmap, including their progress through various activities
 * and lessons. It fetches user data and activities based on the user's current language and displays them in a
 * grid layout. Users can navigate to specific activities or lessons based on their progress.
 */

function Roadmap() {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  /**
   * useEffect - Fetches user data and activities from Firestore when the component mounts.
   */
  useEffect(() => {
    const fetchUserDataAndActivities = async () => {
      try {
        if (!uid) {
          setError('Missing user ID');
          return;
        }

        // Fetch user data
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          setError('User not found');
          return;
        }
        const userData = userDocSnap.data();

        // Calculate and update total XP
        const totalXP = await calculateTotalXP(uid);
        await updateDoc(userDocRef, { xp: totalXP });

        // Update local state with the updated user data
        setUserData({ ...userData, xp: totalXP });

        // Check and set the current language if not already set
        if (!userData.currentLanguage) {
          const programmingLanguagesCollection = collection(db, 'programmingLanguages');
          const programmingLanguagesQuery = query(programmingLanguagesCollection, orderBy('name'));
          const programmingLanguagesSnapshot = await getDocs(programmingLanguagesQuery);
          const firstLanguage = programmingLanguagesSnapshot.docs[0].data();

          await updateDoc(userDocRef, { currentLanguage: firstLanguage.name });
          userData.currentLanguage = firstLanguage.name;
        }

        // Fetch activities based on the user's current language
        const activitiesCollectionName = `activities${userData.currentLanguage}`;
        const activitiesCollection = collection(db, activitiesCollectionName);
        const activitiesQuery = query(activitiesCollection, orderBy('order'));
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const activitiesData = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.order - b.order);

        setActivities(activitiesData);
        
        // Unlock the first activity if it hasn't been unlocked yet
        if (userData.currentActivity === 1 && activitiesData.length > 0) {
          const firstActivity = activitiesData[0];
          if (!firstActivity.unlocked) {
            setShowAnimation(true);
            const activityDocRef = doc(db, activitiesCollectionName, firstActivity.id);
            await updateDoc(activityDocRef, { unlocked: true });
            setTimeout(() => setShowAnimation(false), 600);
          }
        }
        
        // Trigger fade-in animation
        setTimeout(() => setFadeIn(true), 400); // Delay to allow CSS class to apply properly
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      fetchUserDataAndActivities();
    }, 1300); // Adding a delay of 1.3 seconds to simulate loading
  }, [uid]);

  /**
   * useEffect - Adds a scroll event listener to the roadmap page for a parallax effect.
   */
  useEffect(() => {
    const roadmapPage = document.querySelector('.roadmap-page');

    if (!roadmapPage) return;
  
    const handleScroll = () => {
      const scrollPosition = roadmapPage.scrollTop;
      roadmapPage.style.backgroundPositionY = `${scrollPosition}px`;
    };
  
    roadmapPage.addEventListener('scroll', handleScroll);
    
    return () => {
      roadmapPage.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  /**
   * Handles clicks on activities, navigating the user to the selected activity if it's unlocked.
   * @param {object} activity - The activity object containing details about the activity.
   */
  const handleActivityClick = (activity) => {
    if (!activity || !activity.title) {
      console.error("Activity or activity title is undefined.");
      return;
    }

    const activityTitleUrl = activity.title.replace(/\s+/g, '-');
    if (activity.order <= userData.currentActivity) {
      navigate(`/activity/${uid}/${activityTitleUrl}/${activity.order}`);
    } else {
      alert('You need to complete the previous activities first!');
    }
  };

  /**
   * Handles clicks on lessons, navigating the user to the selected lesson if it's unlocked.
   * @param {number} order - The order number of the lesson.
   * @param {string} title - The title of the lesson.
   */
  const handleLessonClick = (order, title) => {
    if (!title) {
      return;
    }
    const lessonTitleUrl = title.replace(/\s+/g, '-');
    const testLessonTitle = 'Data-types-in-Python';
    if (order <= userData.currentActivity) {
      navigate(`/lessonTest/${userData.currentLanguage}/${testLessonTitle}`);
    } else {
      alert('You need to complete the previous activities first!');
    }
  };

  /**
   * Groups activities into rows of a specified size for display in the roadmap.
   * @param {Array} acts - The array of activities to be grouped.
   * @param {number} rowSize - The number of activities per row.
   * @returns {Array} - An array of activity rows.
   */
  const groupActivitiesByRow = (acts, rowSize) => {
    const row = [];
    for (let i = 0; i < acts.length; i += rowSize) {
      row.push(acts.slice(i, i + rowSize));
    }
    return row;
  };

  const rowedActivities = groupActivitiesByRow(activities, 3);

  return (
    <>
      <UserProfileSidebar userData={userData} />
      <div className="roadmap-page">
        <div className="roadmap-header">
          <h2 className="roadmap-title"></h2>
          <LanguageDropdown uid={uid} onLanguageChange={() => setFadeIn(false)} />
        </div>
        {showAnimation && <div className="unlock-animation">New Activity Unlocked!</div>}

        {userData && (
          <div className={`roadmap-container ${fadeIn ? 'fade-in' : ''}`}>
            {rowedActivities.map((row, rowIndex) => (
              <div className="roadmap-row" key={rowIndex}>
                {row.map((activity, index) => (
                  <div className="activity-container" key={index}>
                    <div className="activity-title">
                      <h2>{activity.title}</h2>
                    </div>
                    {activity.order <= userData.currentActivity ? (
                      <div className="activity-buttons">
                        <button onClick={() => handleLessonClick(activity.order, activity.title)}>Learn It!</button>
                        <button onClick={() => handleActivityClick(activity)}>Complete Task!</button>
                      </div>
                    ) : (
                      <p className="locked-message">Locked</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Roadmap;

/**
 * calculateTotalXP
 * 
 * @description Calculates the total XP earned by a user based on their login data.
 * @param {string} userID - The ID of the user for whom the XP is being calculated.
 * @returns {number} - The total XP earned by the user.
 */
async function calculateTotalXP(userID) {
  const userActivityDocRef = doc(db, 'userActivity', userID);
  const docSnap = await getDoc(userActivityDocRef);
  const userLogInData = docSnap.data().loginData || [];

  // Calculate total XP
  const totalXP = userLogInData.reduce((total, entry) => total + entry.xp, 0);
  
  return totalXP;
}
