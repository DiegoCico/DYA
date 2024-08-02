import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import '../css/ParentHub.css';
import ParentHubSidebar from '../components/ParentHubSidebar';
import ParentHubDash from '../components/ParentHubDash';
import ParentHubProfile from '../components/ParentHubProfile';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from "../firebase";

export default function ParentHub() {
    const [dashOpen, setDashOpen] = useState(true)
    const [profileOpen, setProfileOpen] = useState(false)
    const { userId } = useParams();
    const [children, setChildren] = useState([])
    const [userData, setUserData] = useState({})

    const openDash = () => {
        setDashOpen(true)
        setProfileOpen(false)
    }
    const openProfile = () => {
        setProfileOpen(true)
        setDashOpen(false)
    }

    
    const getUserData = async() => {
        const userDocRef = doc(db, 'parents', userId)
        const userDocSnap = await getDoc(userDocRef)
        if (!userDocSnap.exists()) {
            console.log('Missing user')
            return
        }
        
        const data = userDocSnap.data()
        setUserData(data)
    }
    
    const getChildData = async(children) => {
        let tempChildren = []
        for (let i=0; i<children.length; i++) {
            const q = query(collection(db, 'users'), where('uniqueId', '==', children[i]))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach(doc => {
                tempChildren.push({id: doc.id, ...doc.data()})
            })
        }
        setChildren(tempChildren)
    }

    useEffect(() => {
        const getData = async() => {
            await getUserData()
        }
        getData()
    }, [userId])

    useEffect(() => {
        if (userData.children && userData.children.length > 0) {
            const getData = async() => {
                await getChildData(userData.children)
            }
            getData()
        }
    }, [userData])
    
    return (
        <div className="parent-hub-page">
            <ParentHubSidebar openDash={openDash} openProfile={openProfile}/>
            { dashOpen && (
                <ParentHubDash userId={userId} children={children}/>
            )}
            { profileOpen && (
                <ParentHubProfile />
            )}
        </div>
    )
}