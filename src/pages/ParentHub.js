import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import '../css/ParentHub.css';
import ParentHubSidebar from '../components/ParentHubSidebar';
import ParentHubDash from '../components/ParentHubDash';
import ParentHubProfile from '../components/ParentHubProfile';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from "../firebase";

/**
 * ParentHub Component
 * 
 * The `ParentHub` component serves as the main interface for parents to manage their account,
 * view their children's progress, and access various dashboard features. It fetches the parent
 * and children data from Firebase Firestore and renders the appropriate components based on the selected view.
 */

export default function ParentHub() {
    const [dashOpen, setDashOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const { userId } = useParams(); // Extracts the userId parameter from the URL
    const [children, setChildren] = useState([]);
    const [childrenID, setChildrenID] = useState([]);
    const [userData, setUserData] = useState({});

    /**
     * openDash
     * 
     * @description Opens the dashboard view and closes the profile view.
     */
    const openDash = () => {
        setDashOpen(true);
        setProfileOpen(false);
    };

    /**
     * openProfile
     * 
     * @description Opens the profile view and closes the dashboard view.
     */
    const openProfile = () => {
        setProfileOpen(true);
        setDashOpen(false);
    };

    /**
     * getUserData
     * 
     * @description Fetches the parent's user data from Firestore based on the userId.
     */
    const getUserData = async () => {
        const userDocRef = doc(db, 'parents', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
            console.log('User not found');
            return;
        }
        const data = userDocSnap.data();
        setUserData(data);
    };

    /**
     * getChildData
     * 
     * @description Fetches the data for each child associated with the parent from Firestore.
     * @param {Array} children - An array of unique IDs representing the children of the parent.
     */
    const getChildData = async (children) => {
        if (children.length === 0) return;
        let tempChildren = [];
        for (let i = 0; i < children.length; i++) {
            const q = query(collection(db, 'users'), where('uniqueId', '==', children[i]));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
                tempChildren.push({ id: doc.id, ...doc.data() });
            });
        }
        setChildren(tempChildren);
    };

    // Fetch parent data when the component mounts or the userId changes
    useEffect(() => {
        const getData = async () => {
            await getUserData();
        };
        getData();
    }, [userId]);

    // Fetch child data when the userData changes and children are present
    useEffect(() => {
        if (userData.children && userData.children.length > 0) {
            const getData = async () => {
                await getChildData(userData.children);
                setChildrenID(userData.children);
            };
            getData();
        }
    }, [userData]);

    return (
        <div className="parent-hub-page">
            <ParentHubSidebar openDash={openDash} openProfile={openProfile} />
            {dashOpen && (
                <ParentHubDash 
                    userId={userId} 
                    children={children} 
                    getUserData={getUserData} 
                    getChildData={getChildData} 
                    childrenID={childrenID} 
                />
            )}
            {profileOpen && (
                <ParentHubProfile userId={userId} children={children} />
            )}
        </div>
    );
}
