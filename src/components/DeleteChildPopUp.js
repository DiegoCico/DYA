import React from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import '../css/ParentHub.css';

/**
 * DeleteChildPopUp Component
 * 
 * This component renders a confirmation pop-up for deleting a child from the parent's account.
 * It provides options to either confirm the deletion or cancel the operation.
 * 
 * Props:
 * - childID: The unique ID of the child to be deleted.
 * - userId: The unique ID of the parent user who is currently logged in.
 * - setShowDeleteChildPopUp: A function to toggle the visibility of the delete confirmation pop-up.
 * - getChildData: A function to refresh the list of children after a child is deleted.
 * - getUserData: A function to refresh the parent user's data after a child is deleted.
 */

export default function DeleteChildPopUp({ childID, userId, setShowDeleteChildPopUp, getChildData, getUserData }) {

    /**
     * handleDeleteChild
     * 
     * Deletes the specified child from the parent's account. It updates the parent's document in Firestore
     * by removing the child's ID from the list of children. After deletion, it refreshes the parent's data 
     * and the list of children using the provided functions.
     * 
     * @param {string} id - The unique ID of the child to be deleted.
     */
    const handleDeleteChild = async (id) => {
        try {
            const userDocRef = doc(db, 'parents', userId);
            const userDocSnap = await getDoc(userDocRef);
            const userData = userDocSnap.data();
            const updatedChildren = userData.children.filter(childId => childId !== id);

            // Update the parent's document in Firestore with the updated list of children
            await updateDoc(userDocRef, {
                children: updatedChildren
            });

            // Refresh the parent's data and list of children
            await getUserData();
            await getChildData(updatedChildren);

        } catch (error) {
            console.error("Error deleting child:", error.message);
        }

        // Close the delete confirmation pop-up
        setShowDeleteChildPopUp(false);
    };

    return (
        <div className="main-container">
            <div className="submit-button-container">
                <button className="delete-button" onClick={() => handleDeleteChild(childID)}>Delete</button>
                <button className="cancel-delete-button" onClick={() => setShowDeleteChildPopUp(false)}>Cancel</button>
            </div>
        </div>
    );
}
