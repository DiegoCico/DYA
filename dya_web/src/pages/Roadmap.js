import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../css/Roadmap.css';

function Roadmap() {
  const { uid } = useParams(); // Get URL parameter 'uid'
  const [roadmap, setRoadmap] = useState(null); // State to store roadmap data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate(); // Navigation hook

  // Fetch roadmap data when the component mounts
  useEffect(() => {
    const fetchRoadmap = async () => {
      console.log("Fetching roadmap for UID: ", uid); // Debugging line
      try {
        const docRef = doc(db, 'roadmaps', uid); // Reference to the Firestore document
        const docSnap = await getDoc(docRef); // Get the document snapshot
        if (docSnap.exists()) {
          setRoadmap(docSnap.data()); // Set roadmap data
        } else {
          setError('Roadmap not found'); // Set error message
        }
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchRoadmap();
  }, [uid]);

  if (loading) return <div className="loading">Loading...</div>; // Show loading indicator
  if (error) return <div className="error">Error: {error}</div>; // Show error message

  const handleActivityClick = (activityIndex) => {
    navigate(`/activity/${uid}/${activityIndex}`); // Navigate to the activity page
  };

  return (
    <div className="roadmap-page">
      {roadmap && (
        <>
          <h2 className="roadmap-title">{roadmap.name}'s Roadmap</h2> {/* Display roadmap title */}
          <div className="roadmap-container">
            {roadmap.activities.slice().reverse().map((activity, index) => (
              <div
                key={index}
                className="roadmap-item"
                onClick={() => handleActivityClick(roadmap.activities.length - 1 - index)} // Handle activity click
              >
                <h3 className="roadmap-item-title">{activity.title}</h3> {/* Display activity title */}
                <p className="roadmap-item-description">{activity.description}</p> {/* Display activity description */}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Roadmap;
