/* global Sk */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import '../css/Activity.css';
import { useNavigate } from 'react-router-dom';

function Activity() {
  const { uid, activityIndex } = useParams(); // Get URL parameters
  const [activity, setActivity] = useState(null); // State to store activity data
  const [shuffledQuestions, setShuffledQuestions] = useState([]); // State to store shuffled questions
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [userCode, setUserCode] = useState(''); // State to store user code input
  const [output, setOutput] = useState(''); // State to store code output
  const [result, setResult] = useState(null); // State to store result message
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // State to track current question index
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(`/roadmap/${uid}`)
    }

  // Fetch activity and user progress when the component mounts
  useEffect(() => {
    const fetchActivityAndUserProgress = async () => {
      try {
        // Fetch user data
        const userDocRef = doc(db, 'users', uid); // Reference to the user document
        const userDocSnap = await getDoc(userDocRef); // Get the user document snapshot
        if (!userDocSnap.exists()) {
          setError('User not found'); // Set error message
          return;
        }
        const userData = userDocSnap.data();

        // Fetch activities data
        const activitiesCollection = collection(db, 'activities'); // Reference to the activities collection
        const activitiesSnapshot = await getDocs(activitiesCollection); // Get the activities snapshot
        const activitiesData = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const activity = activitiesData[activityIndex]; // Get the specific activity
        setActivity(activity);
        setShuffledQuestions(shuffleArray(activity.questions)); // Shuffle questions
        setCurrentQuestionIndex(0); // Set current question index
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchActivityAndUserProgress();
  }, [uid, activityIndex]);

  // Update the progress in Firestore
  const updateUserProgress = async () => {
    const userDocRef = doc(db, 'users', uid); // Reference to the user document
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.data();
    
    if (activityIndex + 1 > userData.currentActivity) {
      await updateDoc(userDocRef, {
        currentActivity: activityIndex + 2 // Update the current activity in Firestore
      });
    }
  };

  // Run the user's Python code
  const runCode = () => {
    const outf = (text) => {
      setOutput((prevOutput) => prevOutput + text + '\n'); // Append output text
    };

    const builtinRead = (x) => {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
        throw new Error("File not found: '" + x + "'");
      }
      return Sk.builtinFiles["files"][x];
    };

    Sk.pre = "output";
    Sk.configure({ output: outf, read: builtinRead });

    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';

    setOutput(''); // Clear previous output
    Sk.misceval.asyncToPromise(() => {
      return Sk.importMainWithBody("<stdin>", false, userCode, true); // Execute user code
    }).catch((err) => {
      outf(err.toString()); // Display error message
    });
  };

  // Submit the user's code for validation
  const submitCode = () => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex]; // Get the current question
    if (output.trim() === currentQuestion.requiredOutput) {
      setResult('Success! You got it right.'); // Display success message
      if (currentQuestionIndex === shuffledQuestions.length - 1) {
        // All questions completed, update user progress
        updateUserProgress();
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Move to the next question
        setUserCode(''); // Clear the code input
        setOutput(''); // Clear the output
        setResult(null); // Clear the result
      }
    } else {
      setResult('Incorrect output. Try again.'); // Display error message
    }
  };

  // Shuffle an array of questions
  const shuffleArray = (array) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  if (loading) return <div className="loading">Loading...</div>; // Show loading indicator
  if (error) return <div className="error">Error: {error}</div>; // Show error message

  if (activity && currentQuestionIndex >= shuffledQuestions.length) {
    return (
      <div className="activity-page">
        <h2 className="activity-title">{activity.title}</h2>
        <p className="activity-description">Congratulations! You've completed all the questions.</p>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex]; // Get the current question

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
          <div className="coding-section">
            <p className="coding-question">{currentQuestion.codingQuestion}</p>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)} // Update user code input
              placeholder="Write your Python code here..."
            ></textarea>
            <button onClick={runCode}>Run</button>
            <button onClick={submitCode}>Submit</button>
            <div className="output-section">
              <h3>Output:</h3>
              <pre id="output">{output}</pre>
            </div>
            {result && <div className="result-section">{result}</div>}
          </div>
          <div id="mycanvas"></div>
        </>
      )}
    </div>
  );
}

export default Activity;
