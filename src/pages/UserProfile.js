import React, { useState, useEffect } from "react";
import '../css/UserProfile.css';
import { useParams } from "react-router-dom";
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UserProfile(props) {
    const { userData, close } = props;
    const { uid } = useParams();
    const [totalParts, setTotalParts] = useState([]);
    const [userFormData, setUserFormData] = useState({
        name: '',
        username: '',
        email: '',
        profilePicture: '',
        programmingLanguages: [],
        currentActivity: 0
    });
    const [isEdit, setIsEdit] = useState(false);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, "users", uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    // console.log(userData)
                    setUserFormData({
                        name: userData.name,
                        username: userData.username,
                        email: userData.email,
                        profilePicture: userData.profilePicture || `${process.env.PUBLIC_URL}/profile-avatar.png`,
                        programmingLanguages: userData.programmingLanguages || [],
                        currentActivity: userData.currentActivity || 0
                    });
                }
            } catch (error) {
                console.log(error);
            }
        };

        const fetchTotalParts = async () => {
            // console.log(userData.userData.programmingLanguages.length)
            try {
                const parts = []
                for (let i=0; i<userData.userData.programmingLanguages.length; i++) {
                    const activitiesRef = collection(db, `activities${userData.userData.programmingLanguages[i].langName}`);
                    const activitiesSnapshot = await getDocs(activitiesRef);
                    const totalPartsCount = activitiesSnapshot.size;
                    const langSize = {
                        name: userData.userData.programmingLanguages[i].langName,
                        totalSize: totalPartsCount
                    }
                    parts.push(langSize)
                }
                setTotalParts(parts);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserData();
        fetchTotalParts();
    }, [uid]);

    const handleEditClick = () => {
        setIsEdit(true);
    };

    const onEdit = (e) => {
        setUserFormData({
            ...userFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveData = async () => {
        try {
            await updateDoc(doc(db, "users", uid), {
                name: userFormData.name,
                username: userFormData.username,
                email: userFormData.email,
                profilePicture: userFormData.profilePicture
            });
        } catch (error) {
            console.log(error);
        }
        setIsEdit(false);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `profilePictures/${uid}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setUserFormData({
                ...userFormData,
                profilePicture: url
            });
            try {
                await updateDoc(doc(db, "users", uid), {
                    profilePicture: url
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    const getLangLength = (name) => {
        const language = totalParts.find(lang => lang.name === name)
        return language ? language.totalSize : null
    }
    const getUserProgressPercent = (current, length) => {
        return (current / length) * 100
    }

    return (
        <div className="profile-window-overlay">
            <div className="profile-window-content" onClick={(e) => e.stopPropagation()}>
                <div className="user-data-container-left">
                    <button className="close-btn" onClick={close}>X</button>
                    <div className="user-picture">
                        <img src={userFormData.profilePicture} alt="Profile Avatar" onClick={() => document.getElementById('fileInput').click()}></img>
                        <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                    </div>
                    <div className="user-data">
                        <div className="head">
                            <h2>My profile</h2>
                            {!isEdit && <i className="fa-solid fa-pen-to-square" onClick={handleEditClick}></i>}
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
                                <p className="data">{userFormData.email}</p>
                            </>
                        )}
                    </div>
                </div>
                <div className="user-data-container-right">
                    <div className="user-languages-container">
                        <h2>My languages</h2>
                        <div className="border-gray"></div>
                        {userFormData.programmingLanguages.map((language, index) => (
                            <p key={index}>{language.langName}</p>
                        ))}
                    </div>
                    <div className="user-language-progress">
                        <h2>My progress in...</h2>

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
                </div>
            </div>
        </div>
    );
}
