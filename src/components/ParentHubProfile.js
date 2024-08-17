import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ParentHubProfile(props) {
    const { userId, children } = props
    const [profilePic, setProfilePic] = useState(`${process.env.PUBLIC_URL}/profile-avatar.png`)
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        profilePicture: '',
    })
    const [isEdit, setIsEdit] = useState(false)

    const getUserData = async (ID) => {
        try {
            const userDocRef = doc(db, 'parents', ID)
            const userDocSnap = await getDoc(userDocRef)
            if (userDocSnap.exists()) {
                const data = userDocSnap.data()
                setUserData({
                    name: data.name,
                    email: data.email,
                    profilePicture: data.profilePicture || `${process.env.PUBLIC_URL}/profile-avatar.png`,
                })
                setProfilePic(data.profilePicture || `${process.env.PUBLIC_URL}/profile-avatar.png`)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if (userId) {
            getUserData(userId)
        }
    }, [userId])

    const handleEditClick = () => {
        setIsEdit(true)
    }

    const onEdit = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSaveData = async () => {
        try {
            await updateDoc(doc(db, "parents", userId), {
                name: userData.name,
                email: userData.email,
                profilePicture: userData.profilePicture,
            })
        } catch (error) {
            console.error("Error saving user data:", error)
        }
        setIsEdit(false)
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (file) {
            const storageRef = ref(storage, `profilePictures/${userId}`)
            await uploadBytes(storageRef, file)
            const url = await getDownloadURL(storageRef)
            setUserData({
                ...userData,
                profilePicture: url,
            })
            setProfilePic(url)
            try {
                await updateDoc(doc(db, "parents", userId), {
                    profilePicture: url,
                })
            } catch (error) {
                console.error("Error updating profile picture:", error)
            }
        }
    }

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
    )
}
