import React from "react";
import '../css/ParentHub.css';

export default function ParentsHubDash(props) {
    const { userId, children } = props

    return (
        <div className="parent-hub-main-container">
            <div className="children-title">
                <h3>Your Children</h3>
            </div>
            <div className='children-container'>
                {children && children.map((child, index) => (
                    <div className='child-container' id={index}>
                        <div className="child-profile-pic">
                            {child.profilePicture ? (
                                <img src={child.profilePicture} alt="profile-pic"></img>
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
                            <p>{child.currentActivity+1}</p>
                        </div>
                        <div className="child-name-container">
                            <p>{child.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}