import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * ParentHubProfile Component
 *
 * The `ParentHubProfile` component allows parents to view and edit their profile information,
 * including their name, email, and profile picture. It also displays a list of the parent's children.
 *
 * Props:
 * - userId (String): The ID of the parent user.
 * - children (Array): An array of child objects associated with the parent.
 *
 * State:
 * - profilePic (String): The URL of the parent's profile picture.
 * - userData (Object): The parent's profile data, including name, email, and profile picture URL.
 * - isEdit (Boolean): Controls whether the profile is in edit mode.
 *
 * Methods:
 * - getUserData (Function): Fetches the parent's data from Firestore and updates the component's state.
 * - handleEditClick (Function): Enables edit mode for the profile.
 * - onEdit (Function): Handles changes to the profile data when in edit mode.
 * - handleSaveData (Function): Saves the updated profile data to Firestore.
 * - handleFileChange (Function): Handles profile picture upload and updates the profile picture URL in Firestore.
 */
export default function ParentHubProfile(props) {
    const { userId, children } = props;
    const [profilePic, setProfilePic] = useState(`${process.env.PUBLIC_URL}/profile-avatar.png`);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        profilePicture: '',
    });
    const [isEdit, setIsEdit] = useState(false);

    /**
     * Fetches the parent's data from Firestore and updates the component's state.
     * @param {String} ID - The ID of the parent user.
     */
    const getUserData = async (ID) => {
        try {
            const userDocRef = doc(db, 'parents', ID);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const data = userDocSnap.data();
                setUserData({
                    name: data.name,
                    email: data.email,
                    profilePicture: data.profilePicture || `${process.env.PUBLIC_URL}/profile-avatar.png`,
                });
                setProfilePic(data.profilePicture || `${process.env.PUBLIC_URL}/profile-avatar.png`);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (userId) {
            getUserData(userId);
        }
    }, [userId]);

    /**
     * Enables edit mode for the profile.
     */
    const handleEditClick = () => {
        setIsEdit(true);
    };

    /**
     * Handles changes to the profile data when in edit mode.
     * @param {Object} e - The event object from the input field.
     */
    const onEdit = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Saves the updated profile data to Firestore.
     */
    const handleSaveData = async () => {
        try {
            await updateDoc(doc(db, "parents", userId), {
                name: userData.name,
                email: userData.email,
                profilePicture: userData.profilePicture,
            });
        } catch (error) {
            console.error("Error saving user data:", error);
        }
        setIsEdit(false);
    };

    /**
     * Handles profile picture upload and updates the profile picture URL in Firestore.
     * @param {Object} e - The event object from the file input field.
     */
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `profilePictures/${userId}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setUserData({
                ...userData,
                profilePicture: url,
            });
            setProfilePic(url);
            try {
                await updateDoc(doc(db, "parents", userId), {
                    profilePicture: url,
                });
            } catch (error) {
                console.error("Error updating profile picture:", error);
            }
        }
    };

    return (
        <div className="parent-hub-profile-main-container">
            <div className="profile-window-content">
                <div className="user-data-container-left">
                    <div className="user-picture">
                        <img
                            src={profilePic}
                            alt="Profile Avatar"
                            onClick={() => document.getElementById('fileInput').click()}
                        />
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="user-data">
                        <div className="head">
                            <h2>Profile</h2>
                            {!isEdit && <i className="fa-solid fa-pen-to-square" onClick={handleEditClick}></i>}
                        </div>
                        {isEdit ? (
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    value={userData.name}
                                    onChange={onEdit}
                                />
                                <div className="border-gray"></div>
                                <input
                                    type="text"
                                    name="email"
                                    value={userData.email}
                                    onChange={onEdit}
                                />
                                <i className="fa-solid fa-check" onClick={handleSaveData}></i>
                            </>
                        ) : (
                            <>
                                <p className="data">{userData.name}</p>
                                <div className="border-gray"></div>
                                <p className="data">{userData.email}</p>
                            </>
                        )}
                    </div>
                </div>
                <div className="user-data-container-right">
                    <h2>Children</h2>
                    <div className="border-gray"></div>
                    {children && children.length > 0 ? (
                        children.map((child, index) => (
                            <p key={index}>{child.name}</p>
                        ))
                    ) : (
                        <p>No children found</p>
                    )}
                </div>
            </div>
        </div>
    );
}
