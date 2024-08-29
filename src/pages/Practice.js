import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import '../css/Activity.css';
import CodeEditor from '../components/CodeEditor';
import axios from 'axios';
import TestResultsPopup from '../components/TestResultsPopup';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5002');

/**
 * Practice Component
 * 
 * The `Practice` component is designed for users to practice coding by working on random activities. It fetches a random activity
 * from Firestore, shuffles the questions, and allows the user to submit their code for testing. The component also tracks the user's
 * progress, including correct and incorrect answers, and updates their XP.
 */

function Practice() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [serverStatus, setServerStatus] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [userCode, setUserCode] = useState('');
  const [shake, setShake] = useState(false);
  const [fireworks, setFireworks] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('Python'); // Default to Python
  const [slideDown, setSlideDown] = useState(false);
  const date = new Date();

  /**
   * updateUserProgress
   * 
   * @description Updates the user's progress in Firestore, including correct and incorrect answer counts.
   * @param {object} progressUpdates - The progress updates to be saved.
   */
  const updateUserProgress = useCallback(async (progressUpdates) => {
    if (activity) {
      const progressDocRef = doc(db, 'users', uid, 'activities', currentLanguage, 'activityOrder', activity.order.toString());
      const progressDocSnap = await getDoc(progressDocRef);

      const progressData = progressDocSnap.exists() ? progressDocSnap.data() : {};
      await setDoc(progressDocRef, {
        ...progressData,
        ...progressUpdates,
      });
    }
  }, [activity, currentLanguage, uid]);

  /**
   * resetProgress
   * 
   * @description Resets the user's progress for the current activity in Firestore.
   * @param {string} activityOrder - The order of the activity to reset.
   */
  const resetProgress = useCallback(async (activityOrder) => {
    const progressDocRef = doc(db, 'users', uid, 'activities', currentLanguage, 'activityOrder', activityOrder);
    await setDoc(progressDocRef, {
      correctCount: 0,
      incorrectCount: 0,
      completed: false,
    }, { merge: true });

    setCorrectCount(0);
    setIncorrectCount(0);
  }, [currentLanguage, uid]);

  /**
   * addUserXP
   * 
   * @description Adds XP to the user's account for correctly answering a question.
   * @param {number} xp - The amount of XP to add.
   */
  const addUserXP = useCallback(async (xp) => {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    const today = date.toISOString().split('T')[0];

    const userActivityDocRef = doc(db, 'userActivity', uid);
    const docSnap = await getDoc(userActivityDocRef);
    const userLoginData = docSnap.data().loginData;
    let currentDay = userLoginData.find((date) => date.day === today);
    currentDay.xp += xp;

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const currentXP = userData.xp || 0;
      await setDoc(userDocRef, {
        xp: currentXP + xp,
      }, { merge: true });
      await updateDoc(userActivityDocRef, {
        loginData: userLoginData,
      });
    }
  }, [uid]);

  /**
   * useEffect - Fetch Activity and User Progress
   * 
   * @description Fetches a random activity and the user's progress for that activity.
   */
  useEffect(() => {
    const fetchRandomActivityAndUserProgress = async () => {
      try {
        if (!uid) {
          setError('Missing URL parameters');
          return;
        }

        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          setError('User not found');
          return;
        }

        const userData = userDocSnap.data();
        setCurrentLanguage(userData.currentLanguage || 'Python'); // Set the current language from user data

        const activitiesCollection = collection(db, `activities${userData.currentLanguage}`);
        const activitiesSnapshot = await getDocs(activitiesCollection);
        const activitiesData = activitiesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (activitiesData.length === 0) {
          setError('No activities found');
          return;
        }

        // Select a random activity
        const randomActivity = activitiesData[Math.floor(Math.random() * activitiesData.length)];

        setActivity(randomActivity);
        setShuffledQuestions(shuffleArray(randomActivity.questions));
        setCurrentQuestionIndex(0);

        // Load the user's progress
        const progressDocRef = doc(db, 'users', uid, 'activities', userData.currentLanguage, 'activityOrder', randomActivity.order.toString());
        const progressDocSnap = await getDoc(progressDocRef);
        if (progressDocSnap.exists()) {
          const progressData = progressDocSnap.data();
          setCorrectCount(progressData.correctCount || 0);
          setIncorrectCount(progressData.incorrectCount || 0);

          // If the activity was completed, reset progress
          if (progressData.completed) {
            resetProgress(randomActivity.order.toString());
          }
        } else {
          setCorrectCount(0);
          setIncorrectCount(0);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomActivityAndUserProgress();
  }, [uid, resetProgress]);

  /**
   * useEffect - Socket.io Listener for Test Results
   * 
   * @description Listens for test results from the server and updates the UI based on the results.
   */
  useEffect(() => {
    socket.on('test_results', (data) => {
      console.log('Received test results:', data);
      setTestResults(data.testResults || []);
      setResult(data.success ? 'Success! You got it right.' : `Incorrect output:\n${data.message}`);

      if (data.success && isSubmitting) {
        setFireworks(true);
        setTimeout(() => setFireworks(false), 1000);
        setCorrectCount((prevCount) => prevCount + 1);
        updateUserProgress({ correctCount: correctCount + 1 });
        addUserXP(shuffledQuestions[currentQuestionIndex].xp); // Add XP
        setResult(null);
      } else if (!data.success && isSubmitting) {
        setShake(true);
        setTimeout(() => setShake(false), 1000);
        setIncorrectCount((prevCount) => prevCount + 1);
        updateUserProgress({ incorrectCount: incorrectCount + 1 });
        setResult(null);
      }

      setIsSubmitting(false);
    });

    return () => {
      socket.off('test_results');
    };
  }, [correctCount, incorrectCount, shuffledQuestions, isSubmitting, addUserXP, currentQuestionIndex, updateUserProgress]);

  /**
   * handleCodeChange
   * 
   * @description Handles changes to the user's code input.
   * @param {string} newCode - The updated code from the code editor.
   */
  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
  };

  /**
   * handleRunTests
   * 
   * @description Sends the user's code to the backend for testing against predefined test cases.
   * @param {string} userCode - The user's code to be tested.
   * @param {number} testCount - The number of tests to run.
   */
  const handleRunTests = async (userCode, testCount) => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const funcName = currentQuestion.functionName;

    try {
      if (!currentQuestion.id || !uid || !activity.order) {
        setError('Missing parameters for Firestore document reference');
        return;
      }

      // Create the JSON payload
      const payload = {
        functionName: funcName,
        activityOrder: activity.order.toString(),
        userId: uid,
        questionId: currentQuestion.id,
        userCode: userCode,
        language: currentLanguage, // Pass the current language to the backend
        testCount, // Pass the number of tests to run
      };

      // Send the payload to the backend
      await axios.post('http://localhost:5002/test-function', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(`Error testing ${funcName}:`, error);
    }
  };

  /**
   * handleCodeSubmit
   * 
   * @description Submits the user's code and saves it in Firestore.
   * @param {string} userCode - The user's code to be saved and tested.
   * @param {number} testCount - The number of tests to run.
   */
  const handleCodeSubmit = async (userCode, testCount) => {
    setIsSubmitting(true);
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const funcName = currentQuestion.functionName;

    try {
      if (!currentQuestion.id || !uid || !activity.order) {
        setError('Missing parameters for Firestore document reference');
        return;
      }

      // Save the user's code to Firestore
      await setDoc(
        doc(db, 'users', uid, 'activities', currentLanguage, 'activityOrder', activity.order.toString(), 'questions', currentQuestion.id),
        {
          functionName: funcName,
          userCode: userCode,
        }
      );

      // Create the JSON payload
      const payload = {
        functionName: funcName,
        activityOrder: activity.order.toString(),
        userId: uid,
        questionId: currentQuestion.id,
        userCode: userCode,
        language: currentLanguage,
        testCount,
      };

      // Send the payload to the backend
      await axios.post('http://localhost:5002/test-function', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(`Error testing ${funcName}:`, error);
      setIsSubmitting(false);
    }
  };

  /**
   * shuffleArray
   * 
   * @description Shuffles the order of questions in an array.
   * @param {Array} array - The array of questions to be shuffled.
   * @returns {Array} - The shuffled array of questions.
   */
  const shuffleArray = (array) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  /**
   * randomizeQuestion
   * 
   * @description Randomly selects a new question from the shuffled questions array.
   */
  const randomizeQuestion = () => {
    const newIndex = Math.floor(Math.random() * shuffledQuestions.length);
    setCurrentQuestionIndex(newIndex);
  };

  /**
   * handleBackClick
   * 
   * @description Navigates the user back to the previous page.
   */
  const handleBackClick = () => {
    navigate(-1);
  };

  /**
   * checkServerStatus
   * 
   * @description Checks the status of the backend server.
   */
  const checkServerStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5002/ping');
      setServerStatus(response.data.message);
    } catch (error) {
      setServerStatus('Error: Unable to reach the server.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <div className={`activity-page ${shake ? 'shake' : ''}`}>
      {fireworks && (
        <div className="fireworks">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {activity && (
        <>
          <div className='activity-header'>
            <button onClick={handleBackClick} className='back-btn'>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h2 className="activity-title">Practice</h2>
          </div>
          <p className="activity-description">{activity.description}</p>
          <div className="status-section">
            <div className="level-xp">
              <p>Level: {currentQuestion.difficulty}</p>
              <p>XP: {currentQuestion.xp}</p>
            </div>
            <div className="status">
              <div className="status-content correct">{correctCount}</div>
              <div className="status-content incorrect">{incorrectCount}</div>
            </div>
          </div>
          <div className={`activities-container ${slideDown ? 'slide-down' : ''}`}>
            <CodeEditor
              currentQuestion={currentQuestion}
              onCodeSubmit={handleCodeSubmit}
              onRunTests={handleRunTests}
              onCodeChange={handleCodeChange}
              userId={uid}
              language={currentLanguage}
              activityOrder={activity.order.toString()}
              setOutput={() => {}}
            />
          </div>
          {result && <div className="result-section"><pre>{result}</pre></div>}
          {isSubmitting && <div className="loading">Submitting...</div>}
          <div id="mycanvas"></div>
          <button className='code-editor-button' onClick={randomizeQuestion}>Randomize Question</button>
          <button className='code-editor-button' onClick={checkServerStatus}>Check Server Status</button>
          {serverStatus && <div className="server-status">{serverStatus}</div>}
          {testResults.length > 0 && (
            <TestResultsPopup results={testResults} onClose={() => setTestResults([])} />
          )}
        </>
      )}
    </div>
  );
}

export default Practice;
