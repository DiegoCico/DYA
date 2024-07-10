import React, { useRef, useEffect } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from '@codemirror/basic-setup';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

const CodeEditor = ({ code, setCode }) => {
  const editorRef = useRef();

  useEffect(() => {
    if (editorRef.current) {
      const updateListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          setCode(update.state.doc.toString());
        }
      });

      const state = EditorState.create({
        doc: code,
        extensions: [basicSetup, python(), oneDark, updateListener],
      });

      const view = new EditorView({
        state,
        parent: editorRef.current,
      });

      return () => {
        view.destroy();
      };
    }
  }, [code, setCode]);

  return (
    <div ref={editorRef} style={{ border: '1px solid #ddd', borderRadius: '4px', height: '300px' }} />
  );
};

export default CodeEditor;