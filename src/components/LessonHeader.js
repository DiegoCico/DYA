import React from "react";
import '../css/NewLesson.css';

export default function LessonHeader(props) {
    const { lessonTitle, unitTitle, handleBackClick } = props

    return (
        <div className="lesson-header">
            <div className="back-container">
                <button className="back-btn" onClick={handleBackClick}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
            </div>
            <div className="title-container">
                <div className="unit-title">
                    <p>{unitTitle}</p>
                </div>
                <div className="lesson-title">
                    <p>{lessonTitle}</p>
                </div>
            </div>
        </div>
    )
}