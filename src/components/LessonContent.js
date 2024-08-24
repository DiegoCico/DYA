import React, { useState } from "react";
import '../css/NewLesson.css';
import LessonSidebar from "./LessonSidebar";

export default function LessonContent(props) {
    const { lesson } = props;
    const [showLesson, setShowLesson] = useState(true);
    const [showPractice, setShowPractice] = useState(false);
    const [lessonRead, setLessonRead] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [feedback, setFeedback] = useState('');

    const lessonPractice = lesson.practice;

    const lessonPageClick = () => {
        setShowLesson(true);
        setShowPractice(false);
    };

    const practicePageClick = () => {
        if (lessonRead) {
            setShowLesson(false);
            setShowPractice(true);
        }
    };

    const handleContinueClick = () => {
        setLessonRead(true);
        setShowLesson(false);
        setShowPractice(true);
    };

    const handleOptionClick = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleAnswerCheck = () => {
        if (selectedOption === lessonPractice.answer) {
            setFeedback('Correct!');
        } else {
            setFeedback('Let\'s try again.');
        }
    };
    console.log(selectedOption)
    return (
        <div className="main-container">
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
