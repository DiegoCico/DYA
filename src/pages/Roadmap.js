import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import '../css/Roadmap.css';
import UserProfileSidebar from '../components/UserProfileSidebar';
import LanguageDropdown from '../components/LanguageDropdown';

function Roadmap() {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndActivities = async () => {
      try {
        if (!uid) {
          setError('Missing user ID');
          return;
        }

        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          setError('User not found');
          return;
        }
        const userData = userDocSnap.data();

        // Check and set XP attribute if it doesn't exist
        if (userData.xp === undefined) {
          await updateDoc(userDocRef, { xp: 0 });
          userData.xp = 0;
        }

        setUserData(userData);

        // Check and set the current language
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
    }, 1000); // Adding a delay of 1000ms (1 second)
  }, [uid]);

  useEffect(() => {
    const handleScroll = () => {
      const roadmapPage = document.querySelector('.roadmap-page');
      const scrollPosition = window.scrollY;
      roadmapPage.style.backgroundPositionY = `${scrollPosition}px`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

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

  const handleLessonClick = (order, title) => {
    if (!title) {
      return;
    }
    const lessonTitleUrl = title.replace(/\s+/g, '-');
    if (order <= userData.currentActivity) {
      navigate(`/lessons/${uid}/${userData.currentLanguage}/${lessonTitleUrl}`);
    } else {
      alert('You need to complete the previous activities first!');
    }
  };

  const groupActivitiesByRow = (acts, rowSize) => {
    const row = [];
    for (let i = 0; i < acts.length; i += rowSize) {
      row.push(acts.slice(i, i + rowSize));
    }
    return row;
  };

  const getLineClass = (rowIndex, index, rowLength) => {
    if (rowIndex % 2 === 0) {
      if (index < rowLength - 1) {
        return "right";
      }
      return "down";
    } else {
      if (index > 0) {
        return "left";
      }
      return "down";
    }
  };

  const rowedActivities = groupActivitiesByRow(activities, 3);

  return (
    <>
      <UserProfileSidebar userData={userData} />
      <div className="roadmap-page">
        <div className="roadmap-header">
          <h2 className="roadmap-title">Roadmap</h2>
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
