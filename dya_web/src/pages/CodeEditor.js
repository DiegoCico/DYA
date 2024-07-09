// src/pages/CodeEditor.js
import React, { useRef, useEffect } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from '@codemirror/basic-setup';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

const CodeEditor = ({ code, setCode }) => {
  const editor = useRef();

  useEffect(() => {
    if (editor.current) {
      const updateListener = EditorView.updateListener.of((update) => {
        if (update.changes) {
          setCode(update.state.doc.toString());
        }
      });

      const state = EditorState.create({
        doc: code,
        extensions: [basicSetup, python(), oneDark, updateListener],
      });

      const view = new EditorView({
        state,
        parent: editor.current,
      });

      return () => {
        view.destroy();
      };
    }
  }, [code, setCode]);

  return <div ref={editor} style={{ border: '1px solid #ddd', borderRadius: '4px', height: '300px' }} />;
};

export default CodeEditor;
