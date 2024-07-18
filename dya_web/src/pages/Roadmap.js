import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import '../css/Roadmap.css';
import UserProfileSidebar from '../components/UserProfileSidebar';

function Roadmap() {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
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

        const activitiesCollection = collection(db, 'activities');
        const activitiesQuery = query(activitiesCollection, orderBy('order'));
        const activitiesSnapshot = await getDocs(activitiesQuery);
        let activitiesData = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        activitiesData = activitiesData.sort((a, b) => a.order - b.order);

        setUserData(userData);
        setActivities(activitiesData);

        const lastActivityIndex = userData.currentActivity - 1;
        if (lastActivityIndex >= 0 && lastActivityIndex < activitiesData.length) {
          const lastActivity = activitiesData[lastActivityIndex];
          if (lastActivity && !lastActivity.unlocked) {
            setShowAnimation(true);
            const activityDocRef = doc(db, 'activities', lastActivity.id);
            await updateDoc(activityDocRef, { unlocked: true });
            setTimeout(() => setShowAnimation(false), 3000);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchUserDataAndActivities, 500);

    return () => clearTimeout(timer);
  }, [uid]);

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

  return (
    <>
      <UserProfileSidebar />
      <div className="roadmap-page">
        {showAnimation && <div className="unlock-animation">New Activity Unlocked!</div>}
        {userData && (
          <>
            <h2 className="roadmap-title">{userData.username}'s Roadmap</h2>
            <div className="roadmap-container">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`roadmap-item ${activity.order > userData.currentActivity ? 'locked' : ''}`}
                  onClick={() => handleActivityClick(activity)}
                >
                  <h3 className="roadmap-item-title">{activity.title}</h3>
                  <p className="roadmap-item-description">{activity.description}</p>
                  {activity.order > userData.currentActivity && <p className="locked-message">Locked</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Roadmap;
