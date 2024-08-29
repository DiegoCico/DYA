import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LessonHeader from "../components/LessonHeader";
import '../css/NewLesson.css';
import LessonContent from "../components/LessonContent";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Lesson Component
 * 
 * The `Lesson` component is responsible for displaying a specific lesson based on the language and title provided in the URL parameters.
 * It fetches the lesson data from Firebase Firestore and renders it using the `LessonHeader` and `LessonContent` components.
 */

export default function Lesson() {
    // Extracting URL parameters for language and lesson title
    const { language, title } = useParams();
    const [lessonTitle, setLessonTitle] = useState(title.replace(/-/g, ' '));
    const [lesson, setLesson] = useState({});

    const navigate = useNavigate();

    /**
     * handleBackClick
     * 
     * @description Navigates the user back to the previous page.
     */
    const handleBackClick = () => {
        navigate(-1);
    };

    /**
     * getLessonData
     * 
     * @description Fetches lesson data from Firestore based on the lesson title and language.
     * @param {string} lessonTitle - The title of the lesson to fetch.
     */
    const getLessonData = async (lessonTitle) => {
        let lessonData = {
            title: lessonTitle
        };
        try {
            // Query the Firestore collection based on language and lesson title
            const q = query(collection(db, `Lesson${language}`), where('title', '==', lessonTitle));
            const qSnap = await getDocs(q);
            qSnap.forEach(doc => {
                const data = doc.data();
                lessonData = {
                    ...data
                };
            });
        } catch (error) {
            console.log(error.message);
        }
        setLesson(lessonData);
    };

    // Fetch the lesson data when the component mounts or the lessonTitle changes
    useEffect(() => {
        const getData = async () => {
            await getLessonData(lessonTitle);
        };
        getData();
    }, [lessonTitle]);

    return (
        <>
            {lesson && (
                <>
                    {/* Render the lesson header with back button */}
                    <LessonHeader lessonTitle={lesson.title} unitTitle={lesson.unitTitle} handleBackClick={handleBackClick} />
                    {/* Render the lesson content */}
                    <LessonContent lesson={lesson} />
                </>
            )}
        </>
    );
}
