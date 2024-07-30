import React, { useEffect, useState } from 'react';
import { useCodeMirror } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { getCodeTemplate } from './codeTemplate';
import '../css/Activity.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import axios from 'axios';

const CodeEditor = ({ currentQuestion, onCodeSubmit, onRunTests, onCodeChange, userId, language, activityOrder }) => {
  const [userCode, setUserCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');

  const languageExtension = language === 'Java' 
    ? java() 
    : language === 'JavaScript' 
    ? javascript() 
    : python();

  const handleCodeChange = (value) => {
    setUserCode(value);
    onCodeChange(value);
  };

  const { setContainer } = useCodeMirror({
    value: userCode,
    theme: oneDark,
    extensions: [languageExtension],
    onChange: handleCodeChange,
  });

  useEffect(() => {
    const loadUserCode = async () => {
      const docRef = doc(db, 'users', userId, 'activities', language, 'activityOrder', activityOrder, 'questions', currentQuestion.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const savedCode = docSnap.data().userCode;
        setUserCode(savedCode);
      } else {
        const functionName = currentQuestion.functionName;
        const functionTemplate = getCodeTemplate(functionName, language);
        setUserCode(functionTemplate);
        setOriginalCode(functionTemplate);
      }
    };

    loadUserCode();
  }, [currentQuestion, userId, language, activityOrder]);

  const runTests = async () => {
    onRunTests(userCode, 5); // Pass 5 as the number of tests to run
  };

  const restartCode = () => {
    setUserCode(originalCode);
  };

  return (
    <div className="coding-section">
      <p className="coding-question">{currentQuestion.codingQuestion}</p>
      <div ref={setContainer} className="code-editor" />
      <button onClick={restartCode}>Restart</button>
      <button onClick={runTests}>Run Tests</button>
      <button onClick={() => onCodeSubmit(userCode, 50)}>Submit</button> {/* Pass 50 as the number of tests to run */}
    </div>
  );
};

export default CodeEditor;
