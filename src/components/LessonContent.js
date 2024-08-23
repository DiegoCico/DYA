import React, { useState } from "react";
import '../css/NewLesson.css';
import LessonSidebar from "./LessonSidebar";

export default function LessonContent(props) {
    const { lesson } = props
    const [showLesson, setShowLesson] = useState(true)
    const [showPractice, setShowPractice] = useState(false)

    const lessonPageClick = () => {
        setShowLesson(true)
        setShowPractice(false)
    }
    const practicePageClick = () => {
        setShowLesson(false)
        setShowPractice(true)
    }

    console.log(lesson)
    return (
        <div className="main-container">
            <div className="sidebar-container">
                <LessonSidebar lessonPageClick={lessonPageClick} practicePageClick={practicePageClick}/>
            </div>
            {showLesson && lesson.description && (
                <div className="lesson-container">
                    <div className="desc-container">
                        <h3>{lesson.description.description}</h3>
                    </div>
                    <div className="example-container">
                        <h3>Lesson example here</h3>
                    </div>
                </div>
            )}
            {showPractice && (
                <div className="practice-container">
                    <h2>Practice here</h2>
                </div>
            )}
        </div>
    )
}