import React from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import '../css/ParentHub.css';

export default function DeleteChildPopUp({childID, userId, setShowDeleteChildPopUp, getChildData, getUserData}) {
    const handleDeleteChild = async(id) => {
        // console.log('Deleting', id)
        try {
            const userDocRef = doc(db, 'parents', userId)
            const userDocSnap = await getDoc(userDocRef)
            const userData = userDocSnap.data()
            const updatedChildren = userData.children.filter(childId => childId !== id)

            await updateDoc(userDocRef, {
                children: updatedChildren
            })

            await getUserData()
            await getChildData(updatedChildren)
        } catch(error) {
            console.log(error.message)
        }
        setShowDeleteChildPopUp(false)
    }

    return (
        <div className="main-container">
            <div className="submit-button-container">
                <button className="delete-button" onClick={() => handleDeleteChild(childID)}>Delete</button>
                <button className="cancel-delete-button" onClick={() => setShowDeleteChildPopUp(false)}>Cancel</button>
            </div>
        </div>
    )
}