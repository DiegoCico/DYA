import React, { useState } from "react";
import '../css/ParentHub.css';
import ParentHubAddChildPopUp from "./ParentHubAddChildPopUp";

export default function ParentsHubDash(props) {
    const { userId, children, setChildren, getUserData, getChildData } = props
    const [showAddChildPopUp, setShowAddChildPopUp] = useState(false)

    const handleChildPopUp = () => {
        setShowAddChildPopUp(!showAddChildPopUp)
    }

    return (
        <div className="parent-hub-main-container">
            <div className="children-title">
                <h3>Your Children</h3>
            </div>
            <div className='children-container'>
                {children && children.length > 0 ? ( 
                    children.map((child, index) => (
                        <div className='child-container' key={index}>
                            <div className="child-profile-pic">
                                {child.profilePicture ? (
                                    <img src={child.profilePicture} alt="profile-pic" />
                                ) : (
                                    <i className="fa-solid fa-child"></i>
                                )}
                            </div>
                            <div className="child-stats-container">
                                <div className="lang-title">
                                    <p>Current Language</p>
                                </div>
                                <p>{child.currentLanguage}</p>
                                <div className="activity-title">
                                    <p>Current Activity</p>
                                </div>
                                <p>{child.currentActivity + 1}</p>
                            </div>
                            <div className="child-name-container">
                                <p>{child.name}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No children added yet.</p> 
                )}
                <div className="add-child-button">
                    <button onClick={handleChildPopUp}><i className="fa-solid fa-plus"></i></button>
                </div>
            </div>
            {showAddChildPopUp && (
                <div className="add-child-pop-up-overlay" onClick={() => setShowAddChildPopUp(false)}>
                    <div className="child-popup-content" onClick={(e) => e.stopPropagation()}>
                        <ParentHubAddChildPopUp userId={userId} children={children} getUserData={getUserData} setShowAddChildPopUp={setShowAddChildPopUp}/>
                    </div>
                </div>
            )}
        </div>
    )
}