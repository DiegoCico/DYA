import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import UserProfile from "../pages/UserProfile";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';

export default function UserProfileSidebar({ userData }) {
    const { uid } = useParams();
    const navigate = useNavigate();
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [loginData, setLoginData] = useState([]);
    const [streak, setStreak] = useState(0);
    const [monthlyLogins, setMonthlyLogins] = useState(0);

    useEffect(() => {
        const fetchLoginData = async () => {
            if (!uid) return;

            const loginDataRef = collection(db, 'users', uid, 'logins');
            const loginDataSnapshot = await getDocs(query(loginDataRef, orderBy('date', 'asc')));

            const loginDates = loginDataSnapshot.docs.map(doc => doc.data().date.toDate());
            setLoginData(loginDates);
            calculateStreak(loginDates);
            calculateMonthlyLogins(loginDates);
        };

        fetchLoginData();
    }, [uid]);

    const calculateStreak = (dates) => {
        let streak = 0;
        let today = new Date().setHours(0, 0, 0, 0);
        for (let i = 0; i < dates.length; i++) {
            const date = new Date(dates[i]).setHours(0, 0, 0, 0);
            if (date === today) {
                streak++;
                today -= 86400000;
            } else {
                break;
            }
        }
        setStreak(streak);
    };

    const calculateMonthlyLogins = (dates) => {
        const currentMonth = new Date().getMonth();
        const loginsThisMonth = dates.filter(date => new Date(date).getMonth() === currentMonth).length;
        setMonthlyLogins(loginsThisMonth);
    };

    const toggleUserProfile = () => {
        setShowUserProfile(!showUserProfile);
    };

    const handleRouteClick = (route) => {
        navigate(route);
    };

    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigate('/');
        }).catch((error) => {
            console.error("Sign out error:", error);
        });
    };

    return (
        <div className="side-nav">
            <div className="calendar-container">
                <Calendar
                    tileClassName={({ date, view }) => {
                        if (loginData.find(d => new Date(d).setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0))) {
                            return 'react-calendar__tile--logged-in';
                        }
                        return null;
                    }}
                />
                <div className="streak-container">
                    <p>Current Streak: {streak} days</p>
                    <p>Logins This Month: {monthlyLogins}</p>
                </div>
            </div>
            <div className="btn-container">
                <button onClick={() => handleRouteClick(`/roadmap/${uid}`)}>Roadmap</button>
                <button onClick={toggleUserProfile}>Profile</button>
                <button className="logout-btn" onClick={handleSignOut}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
            </div>
            {showUserProfile && userData && (
                <UserProfile userData={userData} close={toggleUserProfile} />
            )}
        </div>
    );
}
