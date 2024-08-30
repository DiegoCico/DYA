import React, { useState } from "react";
import '../css/NewLesson.css';
import LessonSidebar from "./LessonSidebar";

/**
 * LessonContent Component
 * 
 * The `LessonContent` component is responsible for displaying the content of a lesson and its corresponding practice.
 * It allows users to read through lesson descriptions, examples, and then proceed to a practice section where they can 
 * answer questions related to the lesson.
 * 
 * Props:
 * - lesson: An object containing the lesson details including the lesson description and practice.
 * 
 * State:
 * - showLesson: A boolean indicating whether the lesson description should be displayed.
 * - showPractice: A boolean indicating whether the practice section should be displayed.
 * - lessonRead: A boolean indicating whether the user has completed reading the lesson.
 * - selectedOption: The option selected by the user in the practice section.
 * - feedback: The feedback provided to the user after they submit their answer in the practice section.
 * 
 * Functions:
 * - lessonPageClick: Switches the view to the lesson description.
 * - practicePageClick: Switches the view to the practice section if the lesson has been read.
 * - handleContinueClick: Marks the lesson as read and shows the practice section.
 * - handleOptionClick: Updates the selected option based on user input.
 * - handleAnswerCheck: Checks if the selected option is correct and provides feedback.
 */

export default function LessonContent(props) {
    const { lesson } = props;
    const [showLesson, setShowLesson] = useState(true);
    const [showPractice, setShowPractice] = useState(false);
    const [lessonRead, setLessonRead] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [feedback, setFeedback] = useState('');

    const lessonPractice = lesson.practice;

    /**
     * Switches to the lesson description view.
     */
    const lessonPageClick = () => {
        setShowLesson(true);
        setShowPractice(false);
    };

    /**
     * Switches to the practice section if the lesson has been read.
     */
    const practicePageClick = () => {
        if (lessonRead) {
            setShowLesson(false);
            setShowPractice(true);
        }
    };

    /**
     * Marks the lesson as read and shows the practice section.
     */
    const handleContinueClick = () => {
        setLessonRead(true);
        setShowLesson(false);
        setShowPractice(true);
    };

    /**
     * Updates the selected option based on user input.
     * 
     * @param {Event} e - The change event triggered by selecting a radio button.
     */
    const handleOptionClick = (e) => {
        setSelectedOption(e.target.value);
    };

    /**
     * Checks if the selected option is correct and provides feedback to the user.
     */
    const handleAnswerCheck = () => {
        if (selectedOption === lessonPractice.answer) {
            setFeedback('Correct!');
        } else {
            setFeedback('Let\'s try again.');
        }
    };

    return (
        <div className="lesson-main-container">
            <div className="sidebar-container">
                <LessonSidebar lessonPageClick={lessonPageClick} practicePageClick={practicePageClick} lessonRead={lessonRead}/>
            </div>
            {showLesson && lesson.lessonDesc && (
                <div className="lesson-container">
                    <div className="desc-container">
                        <h3>{lesson.lessonDesc.description}</h3>
                    </div>
                    <div className="example-container">
                        <div className="code-section">
                            {lesson.lessonDesc.example.code.map((codeItem, index) => (
                                <div key={index} className="code-item">
                                    <pre>
                                        <code>{codeItem}</code>
                                    </pre>
                                </div>
                            ))}
                        </div>
                        <div className="explanation-section">
                            {lesson.lessonDesc.example.explanation.map((exp, index) => (
                                <div key={index} className="code-item">
                                    <pre>
                                        <code>{exp}</code>
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="continue-button-container">
                        <button onClick={handleContinueClick}>Continue</button>
                    </div>
                </div>
            )}
            {showPractice && (
                <div className="practice-container">
                    <div className="task-container">
                        <h3>{lessonPractice.task}</h3>
                    </div>
                    <div className="options-container">
                        {lessonPractice.choices.map((option, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    name="practice-option"
                                    id={`option-${index}`}
                                    value={option}
                                    checked={selectedOption === option}
                                    onChange={handleOptionClick}
                                />
                                <label htmlFor={`option-${index}`} className="option-label">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                    <button className="submit-button" onClick={handleAnswerCheck}>Submit</button>
                    {feedback && (
                        <div className={`feedback ${feedback === 'Correct!' ? 'correct-feedback' : 'incorrect-feedback'}`}>
                            {feedback}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
