import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserProfileSidebar from '../components/UserProfileSidebar';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import '../css/Ranking.css';

function Ranking() {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [rankingData, setRankingData] = useState([]);
  const [timeFrame, setTimeFrame] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchRankingData = async () => {
      try {
        const rankingCollectionRef = collection(db, 'users');
        const rankingQuery = query(rankingCollectionRef, orderBy('xp', 'desc'));
        const rankingSnapshot = await getDocs(rankingQuery);
        const ranking = rankingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRankingData(ranking);
      } catch (error) {
        console.error('Error fetching ranking data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchRankingData();
  }, [uid, timeFrame]);

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  return (
    <div className="ranking-page">
      <UserProfileSidebar userData={userData} />
      <div className="ranking-content">
        <div className="ranking-header">
          <h2>Ranking</h2>
          <div className="timeframe-buttons">
            <button className={timeFrame === 'week' ? 'active' : ''} onClick={() => handleTimeFrameChange('week')}>Week</button>
            <button className={timeFrame === 'month' ? 'active' : ''} onClick={() => handleTimeFrameChange('month')}>Month</button>
            <button className={timeFrame === 'year' ? 'active' : ''} onClick={() => handleTimeFrameChange('year')}>Year</button>
          </div>
        </div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="ranking-list">
            {rankingData.map((user, index) => (
              <div key={index} className={`ranking-item ${user.id === uid ? 'highlight' : ''}`}>
                <img src={user.profilePicture || `${process.env.PUBLIC_URL}/profile-avatar.png`} alt="Profile" className="profile-pic" />
                <p>{index + 1}. {user.username} - {user.xp} XP</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Ranking;
