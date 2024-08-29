import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserProfileSidebar from '../components/UserProfileSidebar';
import UserProfile from './UserProfile';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import '../css/Ranking.css';

/**
 * Ranking Component
 * 
 * The `Ranking` component displays a leaderboard of users based on their XP within a selected time frame
 * (week, month, or year). It allows users to view and compare their ranking with others and view user profiles.
 */

function Ranking() {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [rankingData, setRankingData] = useState([]);
  const [timeFrame, setTimeFrame] = useState('week'); // Default time frame is set to 'week'
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // Stores the user data for the selected user

  /**
   * Fetches the user data for the logged-in user.
   */
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

    /**
     * Fetches the ranking data for all users and calculates their XP based on the selected time frame.
     */
    const fetchRankingData = async () => {
      try {
        const rankingCollectionRef = collection(db, 'users');
        const rankingSnapshot = await getDocs(rankingCollectionRef);
        const ranking = await Promise.all(
          rankingSnapshot.docs.map(async (userDoc) => {
            const userData = userDoc.data();
            const userActivityDocRef = doc(db, 'userActivity', userDoc.id);
            const userActivityDocSnap = await getDoc(userActivityDocRef);

            let filteredXP = 0;

            if (userActivityDocSnap.exists()) {
              const loginData = userActivityDocSnap.data().loginData;
              filteredXP = calculateFilteredXP(loginData);
            }

            return {
              id: userDoc.id,
              username: userData.username,
              xp: filteredXP,
              profilePicture: userData.profilePicture,
            };
          })
        );

        ranking.sort((a, b) => b.xp - a.xp); // Sort the ranking by XP in descending order
        setRankingData(ranking);
      } catch (error) {
        console.error('Error fetching ranking data:', error);
      } finally {
        setLoading(false);
      }
    };

    /**
     * Calculates the filtered XP for a user based on the selected time frame.
     * @param {Array} loginData - An array of login data entries containing day and XP values.
     * @returns {number} - The total XP within the selected time frame.
     */
    const calculateFilteredXP = (loginData) => {
      const now = new Date();
      let filteredXP = 0;

      loginData.forEach((entry) => {
        const loginDate = new Date(entry.day);
        let isWithinTimeFrame = false;

        if (timeFrame === 'week') {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          isWithinTimeFrame = loginDate >= startOfWeek && loginDate <= now;
        } else if (timeFrame === 'month') {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          isWithinTimeFrame = loginDate >= startOfMonth && loginDate <= now;
        } else if (timeFrame === 'year') {
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          isWithinTimeFrame = loginDate >= startOfYear && loginDate <= now;
        }

        if (isWithinTimeFrame) {
          filteredXP += entry.xp;
        }
      });

      return filteredXP;
    };

    fetchUserData();
    fetchRankingData();
  }, [uid, timeFrame]);

  /**
   * Handles the change of the time frame for the ranking (week, month, year).
   * @param {string} newTimeFrame - The new time frame to be set.
   */
  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  /**
   * Handles the selection of a user from the ranking list to view their profile.
   * @param {object} user - The user object containing their data.
   */
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  /**
   * Handles the closing of the user profile view.
   */
  const handleCloseProfile = () => {
    setSelectedUser(null);
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
              <div key={index} className={`ranking-item ${user.id === uid ? 'highlight' : ''}`} onClick={() => handleUserClick(user)}>
                <img src={user.profilePicture || `${process.env.PUBLIC_URL}/profile-avatar.png`} alt="Profile" className="profile-pic" />
                <p>{index + 1}. {user.username} - {user.xp} XP</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedUser && <UserProfile userData={selectedUser} close={handleCloseProfile} />}
    </div>
  );
}

export default Ranking;
