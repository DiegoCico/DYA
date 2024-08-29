import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import UserProfile from "../pages/UserProfile";
import { doc, getDoc } from 'firebase/firestore';

/**
 * UserProfileSidebar Component
 *
 * The `UserProfileSidebar` component serves as a side navigation bar for a user's profile page.
 * It provides quick access to different sections such as Roadmap, Practice, Ranking, and Profile.
 * Additionally, it includes functionality for logging out and viewing a user's login streak and monthly logins.
 *
 * Props:
 * - userData (Object): Contains information about the user including name, username, email, and profile picture.
 *
 * Dependencies:
 * - `firebase`: Firebase is used to retrieve user activity data and to manage authentication.
 * - `react-router-dom`: Navigation is handled using React Router's `useNavigate` and `useParams` hooks.
 */

export default function UserProfileSidebar({ userData }) {
    const { uid } = useParams();
    const navigate = useNavigate();
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [loginData, setLoginData] = useState([]);
    const [streak, setStreak] = useState(0);
    const [monthlyLogins, setMonthlyLogins] = useState(0);

    useEffect(() => {
        /**
         * Fetches user login data from Firestore and calculates streaks and monthly logins.
         */
        const fetchLoginData = async () => {
            if (!uid) return;

            const userActivityDocRef = doc(db, 'userActivity', uid);
            const docSnap = await getDoc(userActivityDocRef);
            if (docSnap.exists()) {
                const loginData = docSnap.data().loginData.map(entry => entry.day);
                setLoginData(loginData);
                calculateStreak(loginData);
                calculateMonthlyLogins(loginData);
            }
        };

        fetchLoginData();
    }, [uid]);

    /**
     * Calculates the user's current login streak.
     * @param {Array} dates - An array of login dates.
     */
    const calculateStreak = (dates) => {
        let streak = 0;
        let today = new Date().setHours(0, 0, 0, 0);
        for (let i = dates.length - 1; i >= 0; i--) {
            const date = new Date(dates[i]).setHours(0, 0, 0, 0);
            if (date === today) {
                streak++;
                today -= 86400000; // Subtract one day
            } else {
                break;
            }
        }
        setStreak(streak);
    };

    /**
     * Calculates the number of logins the user has made in the current month.
     * @param {Array} dates - An array of login dates.
     */
    const calculateMonthlyLogins = (dates) => {
        const currentMonth = new Date().getMonth();
        const loginsThisMonth = dates.filter(date => new Date(date).getMonth() === currentMonth).length;
        setMonthlyLogins(loginsThisMonth);
    };

    /**
     * Toggles the visibility of the user profile.
     */
    const toggleUserProfile = () => {
        setShowUserProfile(!showUserProfile);
    };

    /**
     * Handles navigation to different routes.
     * @param {string} route - The route to navigate to.
     */
    const handleRouteClick = (route) => {
        navigate(route);
    };

    /**
     * Signs out the current user and redirects to the homepage.
     */
    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigate('/');
        }).catch((error) => {
            console.error("Sign out error:", error);
        });
    };

    return (
        <div className="side-nav">
            {/* Navigation Buttons */}
            <div className="btn-container">
                <button onClick={() => handleRouteClick(`/roadmap/${uid}`)}>Roadmap</button>
                <button onClick={() => handleRouteClick(`/practice/${uid}`)}>Practice</button>
                <button onClick={() => handleRouteClick(`/ranking/${uid}`)}>Ranking</button>
                <button onClick={toggleUserProfile}>Profile</button>
                <button className="logout-btn" onClick={handleSignOut}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
            </div>
            {/* User Profile Modal */}
            {showUserProfile && userData && (
                <UserProfile userData={{ ...userData, id: uid }} close={toggleUserProfile} isOwnProfile={true} />
            )}
        </div>
    );
}
