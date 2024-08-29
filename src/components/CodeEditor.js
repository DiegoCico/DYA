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

/**
 * CodeEditor Component
 * 
 * This component provides a code editor interface for users to write, test, and submit their code 
 * for a given programming challenge. It uses the CodeMirror library for the editor and supports 
 * Python, Java, and JavaScript programming languages.
 * 
 * Props:
 * - currentQuestion: An object containing the current question data, including function name and coding question.
 * - onCodeSubmit: A function to handle the code submission.
 * - onRunTests: A function to handle running the tests on the user's code.
 * - onCodeChange: A function to handle changes in the code editor.
 * - userId: The ID of the user currently logged in.
 * - language: The programming language of the current activity (Python, Java, or JavaScript).
 * - activityOrder: The order of the current activity in the roadmap.
 * 
 * State:
 * - userCode: The code currently written by the user.
 * - originalCode: The original template code provided to the user at the start.
 */

const CodeEditor = ({ currentQuestion, onCodeSubmit, onRunTests, onCodeChange, userId, language, activityOrder }) => {
  const [userCode, setUserCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');

  /**
   * Determines the appropriate language extension for CodeMirror based on the selected language.
   */
  const languageExtension = language === 'Java' 
    ? java() 
    : language === 'JavaScript' 
    ? javascript() 
    : python();

  /**
   * handleCodeChange
   * 
   * Updates the userCode state and triggers the onCodeChange prop whenever the code in the editor changes.
   * 
   * @param {string} value - The new code value from the editor.
   */
  const handleCodeChange = (value) => {
    setUserCode(value);
    onCodeChange(value);
  };

  /**
   * useCodeMirror hook
   * 
   * Sets up the CodeMirror editor with the appropriate theme, language extensions, and event handlers.
   */
  const { setContainer } = useCodeMirror({
    value: userCode,
    theme: oneDark,
    extensions: [languageExtension],
    onChange: handleCodeChange,
  });

  /**
   * useEffect Hook
   * 
   * This effect loads the user's previously saved code for the current question from Firestore.
   * If no code is found, it loads a template code based on the question's function name and the selected language.
   * 
   * Dependencies: currentQuestion, userId, language, activityOrder
   */
  useEffect(() => {
    const loadUserCode = async () => {
      try {
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
      } catch (error) {
        console.error("Error loading user code:", error);
      }
    };

    loadUserCode();
  }, [currentQuestion, userId, language, activityOrder]);

  /**
   * runTests
   * 
   * Handles the execution of test cases on the user's code by triggering the onRunTests prop.
   */
  const runTests = async () => {
    onRunTests(userCode, 5); // Pass 5 as the number of tests to run
  };

  /**
   * restartCode
   * 
   * Resets the code editor to the original template code.
   */
  const restartCode = () => {
    setUserCode(originalCode);
  };

  return (
    <div className="coding-section">
      <p className="coding-question">{currentQuestion.codingQuestion}</p>
      <div ref={setContainer} className="code-editor" />
      <button className="code-editor-button" onClick={restartCode}>Restart</button>
      <button className="code-editor-button" onClick={runTests}>Run Tests</button>
      <button className="code-editor-button" onClick={() => onCodeSubmit(userCode, 50)}>Submit</button>
    </div>
  );
};

export default CodeEditor;
