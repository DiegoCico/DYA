/* global Sk */
import React, { useEffect, useState } from 'react';
import { useCodeMirror } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { getCodeTemplate } from './codeTemplate';
import '../css/Activity.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CodeEditor = ({ currentQuestion, onCodeSubmit, onCodeChange, userId, activityOrder, setOutput }) => {
  const [userCode, setUserCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');

  const handleCodeChange = (value) => {
    setUserCode(value);
    onCodeChange(value);
  };

  const { setContainer } = useCodeMirror({
    value: userCode,
    theme: oneDark,
    extensions: [python()],
    onChange: handleCodeChange,
  });

  useEffect(() => {
    const loadUserCode = async () => {
      const docRef = doc(db, 'users', userId, 'activities', activityOrder, 'questions', currentQuestion.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const savedCode = docSnap.data().userCode;
        setUserCode(savedCode);
      } else {
        const functionName = currentQuestion.functionName;
        const functionTemplate = getCodeTemplate(functionName);
        setUserCode(functionTemplate);
        setOriginalCode(functionTemplate);
      }
    };

    loadUserCode();
  }, [currentQuestion, userId, activityOrder]);

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

    Sk.misceval.asyncToPromise(() => {
      return Sk.importMainWithBody("<stdin>", false, userCode, true);
    }).catch((err) => {
      outf(err.toString());
    });
  };

  const restartCode = () => {
    setUserCode(originalCode);
  };

  return (
    <div className="coding-section">
      <p className="coding-question">{currentQuestion.codingQuestion}</p>
      <div ref={setContainer} className="code-editor" />
      <button onClick={runCode}>Run</button>
      <button onClick={() => onCodeSubmit(userCode)}>Submit</button>
      <button onClick={restartCode}>Restart</button>
    </div>
  );
};

export default CodeEditor;