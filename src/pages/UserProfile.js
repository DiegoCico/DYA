import React, { useState, useEffect } from "react";
import '../css/UserProfile.css';
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * UserProfile Component
 * 
 * The `UserProfile` component displays and allows editing of a user's profile information. 
 * This includes the user's name, username, email, profile picture, programming languages, 
 * and their progress in learning different programming languages.
 * 
 * Props:
 * - userData: Object containing the user's data.
 * - close: Function to close the profile window.
 * - isOwnProfile: Boolean indicating if the profile belongs to the currently logged-in user.
 */
export default function UserProfile(props) {
    const { userData, close, isOwnProfile } = props;
    const [totalParts, setTotalParts] = useState([]);
    const [userFormData, setUserFormData] = useState({
        name: '',
        username: '',
        email: '',
        profilePicture: '',
        programmingLanguages: [],
        currentActivity: 0,
        xp: 0,
        uniqueId: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    /**
     * useEffect - Fetches user data and their associated activities on component mount.
     */
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, "users", userData.id);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const fetchedUserData = userDocSnap.data();
                    setUserFormData({
                        name: fetchedUserData.name,
                        username: fetchedUserData.username,
                        email: fetchedUserData.email,
                        profilePicture: fetchedUserData.profilePicture || `${process.env.PUBLIC_URL}/profile-avatar.png`,
                        programmingLanguages: fetchedUserData.programmingLanguages || [],
                        currentActivity: fetchedUserData.currentActivity || 0,
                        xp: fetchedUserData.xp || 0,
                        uniqueId: fetchedUserData.uniqueId || ''
                    });
                    fetchTotalParts(fetchedUserData.programmingLanguages);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        /**
         * fetchTotalParts - Fetches the total number of activities for each programming language the user is learning.
         * @param {Array} programmingLanguages - Array of programming languages the user is learning.
         */
        const fetchTotalParts = async (programmingLanguages) => {
            try {
                const parts = [];
                for (let i = 0; i < programmingLanguages.length; i++) {
                    const activitiesRef = collection(db, `activities${programmingLanguages[i].langName}`);
                    const activitiesSnapshot = await getDocs(activitiesRef);
                    const langSize = {
                        name: programmingLanguages[i].langName,
                        totalSize: activitiesSnapshot.size
                    };
                    parts.push(langSize);
                }
                setTotalParts(parts);
            } catch (error) {
                console.error("Error fetching total parts:", error);
            }
        };

        if (userData.id) {
            fetchUserData();
        }
    }, [userData.id]);

    /**
     * handleEditClick - Enables editing of the user's profile information.
     */
    const handleEditClick = () => {
        setIsEdit(true);
    };

    /**
     * onEdit - Updates the form data as the user types into the input fields.
     * @param {Event} e - The input change event.
     */
    const onEdit = (e) => {
        setUserFormData({
            ...userFormData,
            [e.target.name]: e.target.value
        });
    };

    /**
     * handleSaveData - Saves the edited user data to Firestore.
     */
    const handleSaveData = async () => {
        try {
            await updateDoc(doc(db, "users", userData.id), {
                name: userFormData.name,
                username: userFormData.username,
                email: userFormData.email,
                profilePicture: userFormData.profilePicture
            });
        } catch (error) {
            console.error("Error saving user data:", error);
        }
        setIsEdit(false);
    };

    /**
     * handleFileChange - Handles the uploading of a new profile picture.
     * @param {Event} e - The file input change event.
     */
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `profilePictures/${userData.id}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setUserFormData({
                ...userFormData,
                profilePicture: url
            });
            try {
                await updateDoc(doc(db, "users", userData.id), {
                    profilePicture: url
                });
            } catch (error) {
                console.error("Error updating profile picture:", error);
            }
        }
    };

    /**
     * getLangLength - Retrieves the total number of activities for a given programming language.
     * @param {string} name - The name of the programming language.
     * @returns {number|null} - The total number of activities, or null if not found.
     */
    const getLangLength = (name) => {
        const language = totalParts.find(lang => lang.name === name);
        return language ? language.totalSize : null;
    };

    /**
     * getUserProgressPercent - Calculates the user's progress in a programming language as a percentage.
     * @param {number} current - The number of activities the user has completed.
     * @param {number} length - The total number of activities for the programming language.
     * @returns {number} - The user's progress as a percentage.
     */
    const getUserProgressPercent = (current, length) => {
        return (current / length) * 100;
    };

    return (
        <div className="profile-window-overlay" onClick={close}>
            <div className="profile-window-content" onClick={(e) => e.stopPropagation()}>
                <div className="user-data-container-left">
                    <button className="close-btn" onClick={close}>X</button>
                    <div className="user-picture">
                        {isOwnProfile ? (
                            <>
                                <img src={userFormData.profilePicture} alt="Profile Avatar" onClick={() => document.getElementById('fileInput').click()} />
                                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                            </>
                        ) : (
                            <img src={userFormData.profilePicture} alt="Profile Avatar" />
                        )}
                    </div>
                    <div className="user-data">
                        <div className="head">
                            <h2>Profile</h2>
                            {!isEdit && isOwnProfile && <i className="fa-solid fa-pen-to-square" onClick={handleEditClick}></i>}
                        </div>
                        {isEdit ? (
                            <>
                                <input type="text" name="name" value={userFormData.name} onChange={onEdit} />
                                <div className="border-gray"></div>
                                <input type="text" name="username" value={userFormData.username} onChange={onEdit} />
                                <div className="border-gray"></div>
                                <input type="text" name="email" value={userFormData.email} onChange={onEdit} />
                                <i className="fa-solid fa-check" onClick={handleSaveData}></i>
                            </>
                        ) : (
                            <>
                                <p className="data">{userFormData.name}</p>
                                <div className="border-gray"></div>
                                <p className="data">{userFormData.username || 'data not found'}</p>
                                <div className="border-gray"></div>
                                {isOwnProfile && <p className="data">{userFormData.email}</p>}
                            </>
                        )}
                    </div>
                </div>
                <div className="user-data-container-right">
                    <div className="user-languages-container">
                        <h2>Languages</h2>
                        <div className="border-gray"></div>
                        {userFormData.programmingLanguages.length > 0 ? (
                            userFormData.programmingLanguages.map((language, index) => (
                                <p key={index}>{language.langName}</p>
                            ))
                        ) : (
                            <p>No languages found.</p>
                        )}
                    </div>
                    <div className="user-language-progress">
                        <h2>Progress in...</h2>
                        {userFormData.programmingLanguages.length > 0 ? (
                            userFormData.programmingLanguages.map((language, index) => (
                                <div className="progress-container" key={index}>
                                    <div className="border-gray"></div>
                                    <p>{language.langName}: {language.currentActivity} of {getLangLength(language.langName)} completed</p>
                                    <div className="progress-bar-outline">
                                        <div className="progress-bar" style={{ width: `${getUserProgressPercent(language.currentActivity, getLangLength(language.langName))}%` }}></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No languages found.</div>
                        )}
                    </div>
                    <div className="user-xp">
                        <h2>XP</h2>
                        <div className="border-gray"></div>
                        <p>{userFormData.xp}</p>
                    </div>
                </div>
                {isOwnProfile && (
                    <div className="user-id-section">
                        <p>Child ID: {userFormData.uniqueId}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
