import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../css/Roadmap.css';

function Roadmap() {
  const { uid } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const docRef = doc(db, 'roadmaps', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRoadmap(docSnap.data());
        } else {
          setError('Roadmap not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [uid]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="roadmap-page">
      <h2 className="roadmap-title">{roadmap.name}'s Roadmap</h2>
      <div className="roadmap-container">
        {roadmap.activities.map((activity, index) => (
          <div key={index} className="roadmap-item">
            <h3 className="roadmap-item-title">{activity.title}</h3>
            <p className="roadmap-item-description">{activity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Roadmap;
