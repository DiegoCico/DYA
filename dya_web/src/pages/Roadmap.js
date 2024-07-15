import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import '../css/Roadmap.css';
import UserProfileSidebar from '../components/UserProfileSidebar';

function Roadmap() {
  const { uid } = useParams(); // Get URL parameter 'uid'
  const [userData, setUserData] = useState(null); // State to store user data
  const [activities, setActivities] = useState([]); // State to store activities data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [showAnimation, setShowAnimation] = useState(false); // State to handle animation display
  const navigate = useNavigate(); // Navigation hook

  // Fetch user data and activities when the component mounts
  useEffect(() => {
    const fetchUserDataAndActivities = async () => {
      try {
        // Fetch user data
        const userDocRef = doc(db, 'users', uid); // Reference to the user document
        const userDocSnap = await getDoc(userDocRef); // Get the user document snapshot
        if (!userDocSnap.exists()) {
          setError('User not found'); // Set error message
          return;
        }
        const userData = userDocSnap.data();

        // Fetch activities data in order
        const activitiesCollection = collection(db, 'activities'); // Reference to the activities collection
        const activitiesQuery = query(activitiesCollection, orderBy('order')); // Order activities by the order field
        const activitiesSnapshot = await getDocs(activitiesQuery); // Get the activities snapshot
        const activitiesData = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setUserData(userData); // Set user data
        setActivities(activitiesData); // Set activities data

        // Check if a new activity is unlocked
        const lastActivityIndex = userData.currentActivity - 1;
        if (lastActivityIndex >= 0 && lastActivityIndex < activitiesData.length) {
          const lastActivity = activitiesData[lastActivityIndex];
          if (lastActivity && !lastActivity.unlocked) {
            setShowAnimation(true);
            // Mark the activity as unlocked
            const activityDocRef = doc(db, 'activities', lastActivity.id);
            await updateDoc(activityDocRef, { unlocked: true });
            setTimeout(() => setShowAnimation(false), 3000); // Hide animation after 3 seconds
          }
        }
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    // Add delay before fetching data
    const timer = setTimeout(fetchUserDataAndActivities, 500); // .5-second delay

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [uid]);

  if (loading) return <div className="loading">Loading...</div>; // Show loading indicator while loading
  if (error) return <div className="error">Error: {error}</div>; // Show error message

  const handleActivityClick = (activityId) => {
    const activityIndex = activities.findIndex(activity => activity.id === activityId);
    if (activityIndex < userData.currentActivity) {
      navigate(`/activity/${uid}/${activityIndex + 1}`); // Navigate to the correct activity page if the user has access
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
            <h2 className="roadmap-title">{userData.username}'s Roadmap</h2> {/* Display roadmap title */}
            <div className="roadmap-container">
              {activities.map((activity) => (
                <div
                  key={activity.id} // Use activity.id as the key
                  className={`roadmap-item ${activity.order > userData.currentActivity ? 'locked' : ''}`} // Add locked class if the activity is not accessible
                  onClick={() => handleActivityClick(activity.id)} // Handle activity click
                >
                  <h3 className="roadmap-item-title">{activity.title}</h3> {/* Display activity title */}
                  <p className="roadmap-item-description">{activity.description}</p> {/* Display activity description */}
                  {activity.order > userData.currentActivity && <p className="locked-message">Locked</p>} {/* Display locked message */}
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
