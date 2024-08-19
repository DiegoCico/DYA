import React, { useEffect, useState } from "react";
import '../css/ParentHub.css';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ChildCard(props) {
    const {child, close} = props
    const [totalParts, setTotalParts] = useState([])
    const [currentLang, setCurrentLang] = useState({})

    const fetchTotalParts = async (programmingLanguages) => {
        try {
            const parts = []
            for (let i = 0; i < programmingLanguages.length; i++) {
                const activitiesRef = collection(db, `activities${programmingLanguages[i].langName}`)
                const activitiesSnapshot = await getDocs(activitiesRef)
                const langSize = {
                    name: programmingLanguages[i].langName,
                    totalSize: activitiesSnapshot.size
                }
                parts.push(langSize)
            }
            setTotalParts(parts)
        } catch (error) {
            console.error("Error fetching total parts:", error)
        }
    }

    const getLangLength = (name) => {
        const language = totalParts.find(lang => lang.name === name)
        return language ? language.totalSize : null
    }

    const getUserProgressPercent = (current, length) => {
        return (current / length) * 100
    }
    
    useEffect(() => {
        const getData = async() => {
            if (child.programmingLanguages) {
                await fetchTotalParts(child.programmingLanguages)
            }
        }
        getData()
    }, [child.programmingLanguages])

    return (
        <div className="child-card-overlay" onClick={close}>
            <div className="child-card-content" onClick={(e) => e.stopPropagation()}>
                <div className="content-left">
                    <div className="child-profile-pic">
                        {child.profilePicture ? (
                            <img src={child.profilePicture} alt="profile-pic" />
                        ) : (
                            <i className="fa-solid fa-child"></i>
                        )}
                    </div>
                </div>
                <div className="content-right">
                    <div className="child-name-container">
                        <p>{child.name}</p>
                    </div>
                    <div className="languages-list-container">
                        <p>Currently learning</p>
                        <div className="languages">
                            {child.programmingLanguages.map((lang, index) => {
                                let icon
                                if (lang.langName === 'Python') {
                                    icon = 'python-icon.png'
                                } else if (lang.langName === 'JavaScript') {
                                    icon = 'js-icon.png'
                                } else if (lang.langName === 'Java') {
                                    icon = 'java-icon.png'
                                }
                                return (
                                    <div key={index} className="language-icon" onClick={() => setCurrentLang(lang)}>
                                        <img src={`${process.env.PUBLIC_URL}/${icon}`}/>
                                    </div>
                                )
                            })}
                        </div>
                        {currentLang.langName && (
                            <div className="language-process-container">
                                <p>{currentLang.langName}: {currentLang.currentActivity} of {getLangLength(currentLang.langName)} completed</p>
                                <div className="progress-bar-outline">
                                    <div className="progress-bar" style={{ width: `${getUserProgressPercent(currentLang.currentActivity, getLangLength(currentLang.langName))}%` }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}