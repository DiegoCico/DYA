/* global Sk */ // This comment is for the Skulpt library, used for running Python code in the browser
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import '../css/Activity.css';

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

  // Fetch activity data when the component mounts
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const docRef = doc(db, 'roadmaps', uid); // Reference to the Firestore document
        const docSnap = await getDoc(docRef); // Get the document snapshot
        if (docSnap.exists()) {
          const roadmapData = docSnap.data(); // Extract data from the snapshot
          const activity = roadmapData.activities[activityIndex]; // Get the specific activity
          setActivity(activity);
          setShuffledQuestions(shuffleArray(activity.questions)); // Shuffle questions
        } else {
          setError('Activity not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [uid, activityIndex]);

  // Update the progress in Firestore
  const updateRoadmapProgress = async () => {
    const docRef = doc(db, 'roadmaps', uid); // Reference to the Firestore document
    await updateDoc(docRef, {
      currentLevel: currentQuestionIndex + 1 // Update the current level in Firestore
    });
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
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Move to the next question
      setUserCode(''); // Clear the code input
      setOutput(''); // Clear the output
      setResult(null); // Clear the result
      updateRoadmapProgress(); // Update the progress in Firestore
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
          <h2 className="activity-title">{activity.title}</h2>
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
