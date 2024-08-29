import React from "react";
import '../css/NewLesson.css';

/**
 * LessonHeader Component
 * 
 * The `LessonHeader` component is responsible for displaying the header of a lesson page.
 * It includes a back button to navigate to the previous page, and it shows the unit title
 * and lesson title at the top of the lesson page.
 * 
 * Props:
 * - lessonTitle: The title of the current lesson being viewed.
 * - unitTitle: The title of the unit that the lesson belongs to.
 * - handleBackClick: A function to handle the back button click, typically used to navigate back to the previous page.
 * 
 * Structure:
 * - The component displays a back button on the left side and the titles (unit and lesson) in the center of the header.
 */

export default function LessonHeader(props) {
    const { lessonTitle, unitTitle, handleBackClick } = props;

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
    );
}
