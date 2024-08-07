import React, { useState } from "react";
import { db } from "../firebase";
import { collection, doc, updateDoc, getDocs, query, where, arrayUnion } from 'firebase/firestore';
import '../css/ParentHub.css';

export default function ParentHubAddChildPopUp( {userId, children, getUserData, setShowAddChildPopUp} ) {
    const [newChildID, setNewChildID] = useState('')
    const [error, setError] = useState('')

    const updateUserChildren = async(childID) => {
        if (childID) {
            const q = query(collection(db, "users"), where("uniqueId", "==", childID));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const childExists = children.some(child => child.uniqueId === childID);
                if (!childExists) {
                    try {
                        const userDocRef = doc(db, "parents", userId);
                        await updateDoc(userDocRef, {
                            children: arrayUnion(childID)
                        });
                        setNewChildID('');
                        await getUserData();
                        setShowAddChildPopUp(false)
                    } catch (error) {
                        console.log(error.message);
                    }
                } else {
                    setError('Child already added');
                }
            } else {
                setError('Child ID not found');
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        updateUserChildren(newChildID)
    }

    return (
        <div className="main-container">
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        className="child-id-input"
                        type="text"
                        placeholder="Child ID"
                        onChange={(e) => setNewChildID(e.target.value)}
                        required
                    />
                </div>
                <div className="submit-button-container">
                    <button type="submit">Add</button>
                </div>
                <div className="error-container">
                    {error && (
                        <p>{error}</p>
                    )}
                </div>
            </form>
        </div>
    )
}