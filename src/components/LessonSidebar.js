import React from "react";
import '../css/NewLesson.css';

/**
 * LessonSidebar Component
 * 
 * The `LessonSidebar` component is responsible for rendering the sidebar navigation buttons
 * for a lesson page. It includes buttons to navigate to the lesson content and, if the lesson 
 * has been read, to the practice section.
 * 
 * Props:
 * - lessonPageClick: A function to handle clicking the "Lesson" button, which navigates to the lesson content.
 * - practicePageClick: A function to handle clicking the "Practice" button, which navigates to the practice section.
 * - lessonRead: A boolean indicating whether the lesson has been read. If true, the "Practice" button is displayed.
 * 
 * The component renders a button for the lesson, and if the lesson has been read, it also shows a button to access the practice section.
 */

export default function LessonSidebar(props) {
    const { lessonPageClick, practicePageClick, lessonRead } = props;

    return (
        <div className="btn-container">
            <button className="lesson-btn" onClick={lessonPageClick}>Lesson</button>
            {lessonRead && (<button className="practice-btn" onClick={practicePageClick}>Practice</button>)}
        </div>
    );
}
