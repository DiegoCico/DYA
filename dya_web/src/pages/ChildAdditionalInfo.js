import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import '../css/SignupInfo.css';

export default function AdditionalInfo() {
    const { userId } = useParams();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const handleProgrammingLanguageSelection = async (language) => {
        try {
            await setDoc(doc(db, 'users', userId), {
                name,
                username,
                age,
                programmingLanguages: [language]
            }, { merge: true });

            console.log('Programming language saved successfully');
            navigate(`/roadmap/${userId}`); // Redirect to the roadmap page
        } catch (error) {
            setError(error.message || 'Failed to save programming language. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username.length > 10) {
            setError('Username cannot be longer than 10 characters.');
            return;
        }
        handleNext();
    };

    return (
        <div className="additional-info-container">
            <form onSubmit={handleSubmit} className="additional-info-form">
                {step === 1 && (
                    <div className="slide-in">
                        <input
                            className="info-input"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <button type="button" className="info-btn-green" onClick={handleNext}>Next</button>
                    </div>
                )}
                {step === 2 && (
                    <div className="slide-in">
                        <input
                            className="info-input"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            maxLength="10"
                            required
                        />
                        <button type="button" className="info-btn-green" onClick={handlePrev}>Back</button>
                        <button type="button" className="info-btn-green" onClick={handleNext}>Next</button>
                    </div>
                )}
                {step === 3 && (
                    <div className="slide-in">
                        <input
                            className="info-input"
                            type="number"
                            placeholder="Age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                        />
                        <button type="button" className="info-btn-green" onClick={handlePrev}>Back</button>
                        <button className="info-btn-green" type="submit">Next</button>
                    </div>
                )}
                {step === 4 && (
                    <div className="slide-in">
                        <p>Select a Fun Programming Language:</p>
                        <div className="language-options">
                            <button
                                type="button"
                                className="info-btn modern"
                                onClick={() => handleProgrammingLanguageSelection('HTML/CSS')}
                            >
                                <span>&#8226;</span> HTML/CSS: Create Beautiful Websites!
                            </button>
                            <button
                                type="button"
                                className="info-btn modern"
                                onClick={() => handleProgrammingLanguageSelection('Java')}
                            >
                                <span>&#8226;</span> Java: Build Amazing Apps!
                            </button>
                            <button
                                type="button"
                                className="info-btn modern"
                                onClick={() => handleProgrammingLanguageSelection('Python')}
                            >
                                <span>&#8226;</span> Python: Code Like a Pro!
                            </button>
                        </div>
                    </div>
                )}
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}
