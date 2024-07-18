import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import '../css/Activity.css';
import CodeEditor from '../components/CodeEditor';
import axios from 'axios';
import { getCodeTemplate } from "../components/codeTemplate";

function TestResultsPopup({ results, onClose }) {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Test Results</h2>
        <button onClick={onClose} className="close-btn">X</button>
        <ul>
          {results.map((result, index) => (
            <li key={index} style={{ color: result.passed ? 'green' : 'red' }}>
              {result.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Activity() {
  const { uid, activityTitle, activityOrder } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [output, setOutput] = useState('');
  const [result, setResult] = useState(null);
  const [serverStatus, setServerStatus] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const fetchActivityAndUserProgress = async () => {
      try {
        if (!uid || !activityTitle || !activityOrder) {
          setError('Missing URL parameters');
          return;
        }

        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          setError('User not found');
          return;
        }

        const activitiesCollection = collection(db, 'activities');
        const activitiesSnapshot = await getDocs(activitiesCollection);
        const activitiesData = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const activity = activitiesData.find(act => act.title.replace(/\s+/g, '-') === activityTitle && act.order.toString() === activityOrder);
        if (!activity) {
          setError('Activity not found');
          return;
        }

        setActivity(activity);
        setShuffledQuestions(shuffleArray(activity.questions));
        setCurrentQuestionIndex(0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityAndUserProgress();
  }, [uid, activityTitle, activityOrder]);

  const updateUserProgress = async () => {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.data();

    if (parseInt(activityOrder) === userData.currentActivity) {
      await updateDoc(userDocRef, {
        currentActivity: userData.currentActivity + 1
      });
    }
  };

  const handleCodeSubmit = async (userCode) => {
    setIsSubmitting(true);
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const funcName = currentQuestion.functionName;

    try {
      if (!currentQuestion.id || !uid || !activityOrder) {
        setError('Missing parameters for Firestore document reference');
        return;
      }

      await setDoc(doc(db, 'users', uid, 'activities', activityOrder, 'questions', currentQuestion.id), {
        functionName: funcName,
        userCode: userCode,
      });

      const response = await axios.post('http://localhost:5002/test-function', {
        functionName: funcName,
        activityOrder: activityOrder,
        userId: uid,
        questionId: currentQuestion.id,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setResult('Success! You got it right.');
        setCorrectCount(correctCount + 1);
        if (correctCount + 1 === 5) {
          updateUserProgress();
          setShowAnimation(true);
          setCompleted(true);
          setTimeout(() => {
            setShowAnimation(false);
            alert('Congratulations! You have completed this phase.');
            setCurrentQuestionIndex(shuffledQuestions.length); // to end the activity
          }, 3000); // duration of the animation
        } else {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setOutput('');
          setResult(null);
        }
      } else {
        setResult(`Incorrect output:\n${response.data.message}`);
        setIncorrectCount(incorrectCount + 1);
        if (incorrectCount + 1 === 3) {
          alert('You have 3 incorrect answers. Restarting...');
          setCorrectCount(0);
          setIncorrectCount(0);
          setCurrentQuestionIndex(0);
          setShuffledQuestions(shuffleArray(activity.questions));
          setOutput('');
          setResult(null);
        }
      }
      setTestResults(response.data.testResults);
    } catch (error) {
      console.error(`Error testing ${funcName}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (value) => {
    setOutput('');
    setResult(null);
  };

  const shuffleArray = (array) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleNextActivity = () => {
    navigate(`/activities/${uid}/${activityTitle}/${parseInt(activityOrder) + 1}`);
  };

  const handleMainMenu = () => {
    navigate(`/roadmap/${uid}`);
  };

  const checkServerStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5002/ping');
      setServerStatus(response.data.message);
    } catch (error) {
      setServerStatus('Error: Unable to reach the server.');
    }
  };

  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      const currentQuestion = shuffledQuestions[currentQuestionIndex];
      testFunction(currentQuestion.functionName);
    }
  }, [activityOrder, currentQuestionIndex, shuffledQuestions]);

  const testFunction = async (funcName) => {
    try {
      const response = await axios.post('http://localhost:5002/test-function', {
        functionName: funcName,
      });
      if (response.data.success) {
        console.log(`${funcName} tests passed successfully!`);
      } else {
        console.error(`${funcName} tests failed. Output: ${response.data.output}`);
      }
    } catch (error) {
      console.error(`Error testing ${funcName}:`, error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  if (activity && (currentQuestionIndex >= shuffledQuestions.length || completed)) {
    return (
      <div className="activity-page">
        <h2 className="activity-title">{activity.title}</h2>
        <p className="activity-description">Congratulations! You've completed all the questions.</p>
        {showAnimation && <div className="animation">Next Activity Unlocked!</div>}
        <div className="completion-buttons">
          <button onClick={handleNextActivity}>Next Activity</button>
          <button onClick={handleMainMenu}>Main Menu</button>
        </div>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <div className="activity-page">
      {activity && (
        <>
          <div className='activity-header'>
            <button onClick={handleBackClick} className='back-btn'>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h2 className="activity-title">{activity.title}</h2>
          </div>
          <p className="activity-description">{activity.description}</p>
          <div className="status-section">
            <div className="status correct-count">Correct: {correctCount}</div>
            <div className="status incorrect-count">Incorrect: {incorrectCount}</div>
          </div>
          <CodeEditor 
            currentQuestion={currentQuestion} 
            onCodeSubmit={handleCodeSubmit}
            onCodeChange={handleCodeChange}
            userId={uid}
            activityOrder={activityOrder}
            setOutput={setOutput}
          />
          <div className="output-section">
            <h3>Output:</h3>
            <pre id="output">{output}</pre>
          </div>
          {result && <div className="result-section"><pre>{result}</pre></div>}
          {isSubmitting && <div className="loading">Submitting...</div>}
          <div id="mycanvas"></div>
          <button onClick={checkServerStatus}>Check Server Status</button>
          {serverStatus && <div className="server-status">{serverStatus}</div>}
          {testResults.length > 0 && (
            <TestResultsPopup results={testResults} onClose={() => setTestResults([])} />
          )}
        </>
      )}
    </div>
  );
}

export default Activity;
