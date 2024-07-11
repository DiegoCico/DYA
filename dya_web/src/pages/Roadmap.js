import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import '../css/Roadmap.css';
import UserProfileSidebar from '../components/UserProfileSidebar';

function Roadmap() {
  const { uid } = useParams(); // Get URL parameter 'uid'
  const [userData, setUserData] = useState(null); // State to store user data
  const [activities, setActivities] = useState([]); // State to store activities data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
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
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchUserDataAndActivities();
  }, [uid]);

  if (loading) return <div className="loading">Loading...</div>; // Show loading indicator
  if (error) return <div className="error">Error: {error}</div>; // Show error message

  const handleActivityClick = (activityIndex) => {
    if (activityIndex <= userData.currentActivity - 1) {
      navigate(`/activity/${uid}/${activityIndex}`); // Navigate to the activity page if the user has access
    } else {
      alert('You need to complete the previous activities first!');
    }
  };

  return (
    <>
      <UserProfileSidebar />
      <div className="roadmap-page">
        {userData && (
          <>
            <h2 className="roadmap-title">{userData.email}'s Roadmap</h2> {/* Display roadmap title */}
            <div className="roadmap-container">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className={`roadmap-item ${index > userData.currentActivity - 1 ? 'locked' : ''}`} // Add locked class if the activity is not accessible
                  onClick={() => handleActivityClick(index)} // Handle activity click
                >
                  <h3 className="roadmap-item-title">{activity.title}</h3> {/* Display activity title */}
                  <p className="roadmap-item-description">{activity.description}</p> {/* Display activity description */}
                  {index > userData.currentActivity - 1 && <p className="locked-message">Locked</p>} {/* Display locked message */}
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
