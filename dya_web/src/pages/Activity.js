/* global Sk */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import '../css/Activity.css';
import { useCodeMirror } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

function Activity() {
  const { uid, activityIndex } = useParams();
  const navigate = useNavigate(); // Use navigate instead of useHistory
  const [activity, setActivity] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCode, setUserCode] = useState(`# Write your code here\n# You can start coding right away\n# The editor will scroll if the content gets too long\n\n`);
  const [output, setOutput] = useState('');
  const [result, setResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleCodeChange = (value, viewUpdate) => {
    setUserCode(value);
  };

  const { setContainer } = useCodeMirror({
    value: userCode,
    theme: oneDark,
    extensions: [python()],
    onChange: handleCodeChange,
  });

  useEffect(() => {
    const fetchActivityAndUserProgress = async () => {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          setError('User not found');
          return;
        }

        const activitiesCollection = collection(db, 'activities');
        const activitiesSnapshot = await getDocs(activitiesCollection);
        const activitiesData = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const activity = activitiesData[activityIndex];
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
  }, [uid, activityIndex]);

  const updateUserProgress = async () => {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.data();

    if (activityIndex + 1 > userData.currentActivity) {
      await updateDoc(userDocRef, {
        currentActivity: activityIndex + 2
      });
    }
  };

  const runCode = () => {
    const outf = (text) => {
      setOutput((prevOutput) => prevOutput + text + '\n');
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

    setOutput('');
    Sk.misceval.asyncToPromise(() => {
      return Sk.importMainWithBody("<stdin>", false, userCode, true);
    }).catch((err) => {
      outf(err.toString());
    });
  };

  const submitCode = () => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (output.trim() === currentQuestion.requiredOutput) {
      setResult('Success! You got it right.');
      if (currentQuestionIndex === shuffledQuestions.length - 1) {
        updateUserProgress();
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setUserCode(`# Write your code here\n# You can start coding right away\n# The editor will scroll if the content gets too long\n\n`);
        setOutput('');
        setResult(null);
      }
    } else {
      setResult('Incorrect output. Try again.');
    }
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
    navigate(-1); // Navigate back to the previous page
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  if (activity && currentQuestionIndex >= shuffledQuestions.length) {
    return (
      <div className="activity-page">
        <h2 className="activity-title">{activity.title}</h2>
        <p className="activity-description">Congratulations! You've completed all the questions.</p>
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
          <div className="coding-section">
            <p className="coding-question">{currentQuestion.codingQuestion}</p>
            <div ref={setContainer} className="code-editor" />
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
