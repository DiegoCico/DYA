/* global Sk */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import '../css/Activity.css';

function Activity() {
  const { uid, activityIndex } = useParams();
  const [activity, setActivity] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [result, setResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const docRef = doc(db, 'roadmaps', uid); // Using collection ID 'roadmaps' and document ID 'uid'
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const roadmapData = docSnap.data();
          const activity = roadmapData.activities[activityIndex];
          setActivity(activity);
          setShuffledQuestions(shuffleArray(activity.questions));
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

  const updateRoadmapProgress = async () => {
    const docRef = doc(db, 'roadmaps', uid);
    await updateDoc(docRef, {
      currentLevel: currentQuestionIndex + 1
    });
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
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setUserCode(''); // Clear the code input
      setOutput(''); // Clear the output
      setResult(null); // Clear the result
      updateRoadmapProgress(); // Update the progress in Firestore
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
          <h2 className="activity-title">{activity.title}</h2>
          <p className="activity-description">{activity.description}</p>
          <div className="coding-section">
            <p className="coding-question">{currentQuestion.codingQuestion}</p>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
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
