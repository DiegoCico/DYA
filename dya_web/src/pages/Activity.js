/* global Sk */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import CodeEditor from './CodeEditor';
import '../css/Activity.css';

function Activity() {
  const { uid, activityIndex } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const docRef = doc(db, 'roadmaps', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const roadmap = docSnap.data();
          setActivity(roadmap.activities[activityIndex]);
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

  const handleRunCode = () => {
    const builtinRead = (x) => {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw new Error(`File not found: '${x}'`);
      return Sk.builtinFiles["files"][x];
    };

    Sk.configure({ output: setOutput, read: builtinRead });

    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'output';

    const myPromise = Sk.misceval.asyncToPromise(() => {
      return Sk.importMainWithBody('<stdin>', false, userCode, true);
    });

    myPromise.then(
      () => {
        console.log('success');
      },
      (err) => {
        setOutput(err.toString());
      }
    );
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="activity-page">
      <h2 className="activity-title">{activity.title}</h2>
      <p className="activity-description">{activity.description}</p>
      <div className="activity-questions">
        {activity.questions.map((q, index) => (
          <div key={index} className="question">
            <p>{q.question}</p>
            {q.options.map((option, idx) => (
              <label key={idx}>
                <input type="radio" name={`question-${index}`} value={option} />
                {option}
              </label>
            ))}
          </div>
        ))}
      </div>
      <div className="code-editor">
        <CodeEditor code={userCode} setCode={setUserCode} />
        <button onClick={handleRunCode}>Run Code</button>
        <div className="output">
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default Activity;
