import React, { useState } from "react";
import '../css/ParentHub.css';
import ParentHubAddChildPopUp from "./ParentHubAddChildPopUp";
import DeleteChildPopUp from "./DeleteChildPopUp";
import LineGraph from "./LineGraph";
import Leaderboard from "./Leaderboard";
import ChildCard from "./ChildCard";

export default function ParentsHubDash(props) {
    const { userId, children, getUserData, getChildData, childrenID } = props
    const [showAddChildPopUp, setShowAddChildPopUp] = useState(false)
    const [showDeleteChildPopUp, setShowDeleteChildPopUp] = useState(false)
    const [childToDeleteID, setChildToDeleteID] = useState('')
    const [selectedChild, setSelectedChild] = useState(null)

    const handleChildPopUp = () => {
        setShowAddChildPopUp(!showAddChildPopUp)
    }

    const handleDeletePopUp = (id) => {
        setShowDeleteChildPopUp(!showDeleteChildPopUp)
        setChildToDeleteID(id)
    }

    const handleChildCardClick = (child) => {
        setSelectedChild(child)
    }

    const closeChildCard = () => {
        setSelectedChild(null)
    }

    return (
        <div className="parent-hub-main-container">
            <div className="children-title">
                <h3>Your Children</h3>
            </div>
            <div className='children-container'>
                {children && children.length > 0 ? ( 
                    children.map((child, index) => (
                        <div className='child-container' key={index} onClick={() => handleChildCardClick(child)}>
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
                                <button onClick={() => handleDeletePopUp(child.uniqueId)}><i className="fa-solid fa-trash"></i></button>
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
            <div className="data-container">
                <div className="line-graph-container">
                    <div className="line-graph-title">
                        <h3>XP Graph</h3>
                    </div>
                    <div className="line-graph">
                        <LineGraph childrenID={childrenID}/>
                    </div>
                </div>
                <div className="table-container">
                    <div className="table-title">
                        <h3>Leaderboard</h3>
                    </div>
                    <div className="table-container">
                        <Leaderboard children={children}/>
                    </div>
                </div>
            </div>
            {showAddChildPopUp && (
                <div className="add-child-pop-up-overlay" onClick={() => setShowAddChildPopUp(false)}>
                    <div className="child-popup-content" onClick={(e) => e.stopPropagation()}>
                        <ParentHubAddChildPopUp userId={userId} children={children} getUserData={getUserData} setShowAddChildPopUp={setShowAddChildPopUp}/>
                    </div>
                </div>
            )}

            {showDeleteChildPopUp && (
                <div className="delete-child-pop-up-overlay" onClick={() => setShowDeleteChildPopUp(false)}>
                    <div className="delete-popup-content" onClick={(e) => e.stopPropagation()}>
                        <DeleteChildPopUp childID={childToDeleteID} userId={userId} setShowDeleteChildPopUp={setShowDeleteChildPopUp} getChildData={getChildData} getUserData={getUserData}/>
                    </div>
                </div>
            )}

            {selectedChild && (
                <ChildCard child={selectedChild} close={closeChildCard}/>
            )}
        </div>
    )
}