import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LessonHeader from "../components/LessonHeader";
import '../css/NewLesson.css';
import LessonContent from "../components/LessonContent";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function Lesson() {
    const {language, title} = useParams()
    const [lessonTitle, setLessonTitle] = useState(title.replace(/-/g, ' '))
    const [lesson, setLesson] = useState({})

    const navigate = useNavigate()
    const handleBackClick = () => {
        navigate(-1)
    }

    const getLessonData = async(lessonTitle) => {
        let lessonData = {
            title:lessonTitle
        }
        try {
            const q = query(collection(db, `Lesson${language}`), where('title', '==', lessonTitle))
            const qSnap = await getDocs(q)
            qSnap.forEach(doc => {
                const data = doc.data()
                lessonData.unitTitle = data.unitTitle
                lessonData.description = data.lessonDesc
            })
        } catch(error) {
            console.log(error.message)
        }
        setLesson(lessonData)
    }

    useEffect(() => {
        const getData = async() => {
            await getLessonData(lessonTitle)
        }
        getData()

    }, [lessonTitle])

    return (
        <>
            {lesson && (
                <>
                    <LessonHeader lessonTitle={lesson.title} unitTitle={lesson.unitTitle} handleBackClick={handleBackClick} />
                    <LessonContent lesson={lesson}/>
                </>
            )}
        </>
    )
}