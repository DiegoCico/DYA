import React, { useEffect, useState } from "react";
import '../css/ParentHub.css';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * ChildCard Component
 * 
 * The `ChildCard` component displays a modal with detailed information about a child's progress in learning programming languages. 
 * The component fetches data on the total number of activities for each programming language and calculates the child's progress.
 * 
 * Props:
 * - child: An object containing the child's data, including name, profile picture, and programming languages.
 * - close: A function to close the modal.
 */
export default function ChildCard(props) {
    const { child, close } = props;
    const [totalParts, setTotalParts] = useState([]);
    const [currentLang, setCurrentLang] = useState({});

    /**
     * fetchTotalParts - Fetches the total number of activities for each programming language the child is learning.
     * 
     * @param {Array} programmingLanguages - Array of programming languages the child is learning.
     */
    const fetchTotalParts = async (programmingLanguages) => {
        try {
            const parts = [];
            for (let i = 0; i < programmingLanguages.length; i++) {
                const activitiesRef = collection(db, `activities${programmingLanguages[i].langName}`);
                const activitiesSnapshot = await getDocs(activitiesRef);
                const langSize = {
                    name: programmingLanguages[i].langName,
                    totalSize: activitiesSnapshot.size
                };
                parts.push(langSize);
            }
            setTotalParts(parts);
        } catch (error) {
            console.error("Error fetching total parts:", error);
        }
    };

    /**
     * getLangLength - Retrieves the total number of activities for a given programming language.
     * 
     * @param {string} name - The name of the programming language.
     * @returns {number|null} - The total number of activities, or null if not found.
     */
    const getLangLength = (name) => {
        const language = totalParts.find(lang => lang.name === name);
        return language ? language.totalSize : null;
    };

    /**
     * getUserProgressPercent - Calculates the child's progress in a programming language as a percentage.
     * 
     * @param {number} current - The number of activities the child has completed.
     * @param {number} length - The total number of activities for the programming language.
     * @returns {number} - The child's progress as a percentage.
     */
    const getUserProgressPercent = (current, length) => {
        return (current / length) * 100;
    };

    /**
     * useEffect - Fetches total parts data when the component mounts or when the child's programming languages change.
     */
    useEffect(() => {
        const getData = async () => {
            if (child.programmingLanguages) {
                await fetchTotalParts(child.programmingLanguages);
            }
        };
        getData();
    }, [child.programmingLanguages]);

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
                                let icon;
                                if (lang.langName === 'Python') {
                                    icon = 'python-icon.png';
                                } else if (lang.langName === 'JavaScript') {
                                    icon = 'js-icon.png';
                                } else if (lang.langName === 'Java') {
                                    icon = 'java-icon.png';
                                }
                                return (
                                    <div key={index} className="language-icon" onClick={() => setCurrentLang(lang)}>
                                        <img src={`${process.env.PUBLIC_URL}/${icon}`} alt={`${lang.langName} icon`} />
                                    </div>
                                );
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
    );
}
