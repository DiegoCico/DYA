import React, { useState } from "react";
import { db } from "../firebase";
import { collection, doc, updateDoc, getDocs, query, where, arrayUnion } from 'firebase/firestore';
import '../css/ParentHub.css';

/**
 * ParentHubAddChildPopUp Component
 *
 * This component renders a popup form that allows a parent to add a new child to their account in the Parent Hub.
 *
 * Props:
 * - userId (string): The ID of the parent user.
 * - children (Array): An array of the current children associated with the parent's account.
 * - getUserData (Function): A function to refresh the parent's data after a child has been added.
 * - setShowAddChildPopUp (Function): A function to toggle the visibility of the add child popup.
 *
 * State:
 * - newChildID (string): The ID entered by the user to add a new child.
 * - error (string): An error message displayed if the child ID is invalid or already added.
 *
 * Methods:
 * - updateUserChildren(childID): Adds a child to the parent's account if the child ID is valid and not already added.
 * - handleSubmit(e): Handles the form submission to add a new child.
 */

export default function ParentHubAddChildPopUp({ userId, children, getUserData, setShowAddChildPopUp }) {
    const [newChildID, setNewChildID] = useState('');
    const [error, setError] = useState('');

    /**
     * Adds a child to the parent's account if the child ID is valid and not already added.
     * @param {string} childID - The unique ID of the child to add.
     */
    const updateUserChildren = async (childID) => {
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
                        setShowAddChildPopUp(false);
                    } catch (error) {
                        console.error('Error updating user children:', error.message);
                    }
                } else {
                    setError('Child already added');
                }
            } else {
                setError('Child ID not found');
            }
        }
    };

    /**
     * Handles the form submission to add a new child.
     * @param {object} e - The event object from the form submission.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserChildren(newChildID);
    };

    return (
        <div className="main-container">
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        className="child-id-input"
                        type="text"
                        placeholder="Child ID"
                        value={newChildID}
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
    );
}
