import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../css/Lessons.css'
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';

export default function Lessons() {
    const { uid, language, lessonTitle } = useParams()
    const navigate = useNavigate()
    const [error, setError] = useState()
    const [lessons, setLessons] = useState([]);
    const [openLesson, setOpenLesson] = useState('Introduction')
    const [openLessonTitle, setOpenLessonTitle] = useState('')
    const [openLessonSteps, setOpenLessonSteps] = useState('')
    const [sectionTitle, setSectionTitle] = useState(lessonTitle.replace(/-/g, ' '))
    const [sectionLessons, setSectionLessons] = useState([])

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleLessonChange = (title) => {
        setOpenLesson(title)

    }
    
    useEffect(() => {
        const fetchLessonsData = async () => {
            try {
                if (!uid || !lessonTitle) {
                    setError('Missing user ID or lesson');
                    return;
                }

                // Load the lesson based on the passed-in title
                const lessonsCollection = collection(db, `Lesson${language}`);
                const lessonsQuery = query(lessonsCollection, where('title', '==', sectionTitle));
                const lessonsSnapshot = await getDocs(lessonsQuery);
                const lessonsData = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (lessonsData.length > 0) {
                    setLessons(lessonsData[0]);
                    setSectionLessons(lessonsData[0].steps);
                } else {
                    setError('Lesson not found');
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchLessonsData();
    }, [uid, language, lessonTitle, sectionTitle]);

    console.log(lessons)

    const currentLesson = sectionLessons.find(lesson => lesson.title === openLesson)

    return (
        <>
            <div className="lesson-page">
                <div className="lesson-page-header">
                    <button onClick={handleBackClick} className='back-btn'>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <h1>{sectionTitle}</h1>
                </div>
                <div className="lesson-content-container">
                    <div className="lesson-tabs">
                        <button
                            className={`tablinks ${openLesson === 'Introduction' ? 'active':''}`}
                            onClick={() => handleLessonChange('Introduction')}
                        >
                            Introduction
                        </button>
                        {sectionLessons.map((lesson, index) => (
                            <button
                            key={index}
                            className={`tablinks ${openLesson === lesson.title ? 'active' : ''}`}
                            onClick={() => handleLessonChange(lesson.title)}
                        >
                            {lesson.title}
                         </button>
                        ))}
                    </div>
                    <div className="lesson-main">
                        {openLesson === 'Introduction' ? (
                            <div>
                                <h2>{lessons.description}</h2>
                                <h2>{lessons.objective}</h2>
                                <p>{lessons.materials}</p>
                            </div>
                        ) : (
                            <>
                                <h2>{openLesson}</h2>
                                <h3>{currentLesson.instruction}</h3>
                                <p>{currentLesson.steps}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}