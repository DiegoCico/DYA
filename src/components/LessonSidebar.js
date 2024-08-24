import React from "react";
import '../css/NewLesson.css';

export default function LessonSidebar(props) {
    const { lessonPageClick, practicePageClick, lessonRead } = props

    return (
        <div className="btn-container">
            <button className="lesson-btn" onClick={lessonPageClick}>Lesson</button>
            {lessonRead && (<button className="practice-btn" onClick={practicePageClick}>Practice</button>)}
        </div>
    )
}