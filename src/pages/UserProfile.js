import React, { useState } from "react";
import '../css/UserProfile.css';
import { useParams } from "react-router-dom";
import { auth, db } from '../firebase';
import { doc, updateDoc } from "firebase/firestore";


export default function UserProfile( props ) {
    const { userData, close } = props
    const { uid } = useParams()
    const totalParts = 10
    const progressPercent = (userData.userData.currentActivity/totalParts) * 100
    const [ userFormData, setUserFormData ] = useState({
        name: userData.userData.name,
        username: userData.userData.username,
        email: userData.userData.email
    })
    const [ isEdit, setIsEdit ] = useState(false)

    const handleEditClick = () => {
        setIsEdit(true)
    }

    const onEdit = (e) => {
        setUserFormData({
            ...userFormData,
            [e.target.name]: e.target.value
        })
    }

    const handleSaveData = async() => {
        try {
            await updateDoc(doc(db, "users", uid), {
                name: userFormData.name,
                username: userFormData.username,
                email: userFormData.email
            })
        } catch (error) {
            console.log(error)
        }
        setIsEdit(false)
    }

    return (
        <div className="profile-window-overlay">
            <div className="profile-window-content" onClick={(e) => e.stopPropagation()}>
                <div className="user-data-container-left">
                    <button className="close-btn" onClick={close}>X</button>
                    <div className="user-picture">
                        <img src={`${process.env.PUBLIC_URL}/profile-avatar.png`}></img>
                    </div>
                    <div className="user-data">
                        <div className="head">
                            <h2>My profile</h2>
                            {!isEdit && <i className="fa-solid fa-pen-to-square" onClick={handleEditClick}></i>}
                        </div>
                        {isEdit ? (
                            // <div className="user-edit-form">
                            <>
                                <input type="text" name="name" value={userFormData.name} onChange={onEdit}/>
                                <div className="border-gray"></div>
                                <input type="text" name="username" value={userFormData.username} onChange={onEdit}/>
                                <div className="border-gray"></div>
                                <input type="text" name="email" value={userFormData.email} onChange={onEdit}/>
                                <i class="fa-solid fa-check" onClick={handleSaveData}></i>
                            </>
                            // </div>
                        ) : (
                            <>
                                <p className="data">{userData.userData.name}</p>
                                <div className="border-gray"></div>
                                <p className="data">{userData.userData.username || 'data not found'}</p>
                                <div className="border-gray"></div>
                                <p className="data">{userData.userData.email}</p>
                            </>
                        )}
                    </div>
                </div>
                <div className="user-data-container-right">
                    <div className="user-languages-container">
                        <h2>My languages</h2>
                        <div className="border-gray"></div>
                        <p>{userData.userData.programmingLanguages}</p>
                    </div>
                    <div className="user-language-progress">
                        <h2>My progress in...</h2>
                        
                        {userData.userData.programmingLanguages && userData.userData.programmingLanguages.length > 0 ? (
                            userData.userData.programmingLanguages.map((language, index) => (
                                <div className="progress-container">
                                    <div className="border-gray"></div>
                                    <p key={index}>{language}: {userData.userData.currentActivity} of {totalParts} sections completed</p>
                                    <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                            ))
                        ) : (
                            <p>No programming languages found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}