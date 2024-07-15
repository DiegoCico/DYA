/* global Sk */
import React, { useEffect, useState } from 'react';
import { useCodeMirror } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { getCodeTemplate } from './codeTemplate';
import '../css/Activity.css';

const CodeEditor = ({ currentQuestion, onCodeRun, onCodeSubmit, onCodeChange }) => {
  const [userCode, setUserCode] = useState('');

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
    const functionName = currentQuestion.functionName;
    const functionTemplate = getCodeTemplate(functionName);
    setUserCode(functionTemplate);
  }, [currentQuestion]);

  const runCode = () => {
    const outf = (text) => {
      onCodeRun(text);
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

  return (
    <div className="coding-section">
      <p className="coding-question">{currentQuestion.codingQuestion}</p>
      <div ref={setContainer} className="code-editor" />
      <button onClick={runCode}>Run</button>
      <button onClick={() => onCodeSubmit(userCode)}>Submit</button>
    </div>
  );
};

export default CodeEditor;
