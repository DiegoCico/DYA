/* global Sk */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
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
        const docRef = doc(db, 'roadmaps', uid); // Using collection ID 'roadmaps' and document ID 'uid'
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const roadmapData = docSnap.data();
          setActivity(roadmapData.activities[activityIndex]);
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

  const runCode = () => {
    const outf = (text) => {
      setOutput((prevOutput) => prevOutput + text + '\n');
    };

    const builtinRead = (x) => {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="activity-page">
      <h2 className="activity-title">{activity.title}</h2>
      <p className="activity-description">{activity.description}</p>
      <div className="question-section">
        {activity.questions.map((q, index) => (
          <div key={index} className="question-item">
            <p>{q.question}</p>
            {q.options.map((option, idx) => (
              <div key={idx}>
                <input type="radio" id={`option-${index}-${idx}`} name={`question-${index}`} value={option} />
                <label htmlFor={`option-${index}-${idx}`}>{option}</label>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="coding-section">
        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          placeholder="Write your Python code here..."
        ></textarea>
        <button onClick={runCode}>Run</button>
        <div className="output-section">
          <h3>Output:</h3>
          <pre id="output">{output}</pre>
        </div>
      </div>
      <div id="mycanvas"></div>
    </div>
  );
}

export default Activity;