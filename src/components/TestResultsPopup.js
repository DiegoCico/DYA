import React, { useEffect, useRef, useState } from 'react';
import '../css/Popup.css';
import { diffWords } from 'diff';

function TestResultsPopup({ results, onClose }) {
  const [selectedResult, setSelectedResult] = useState(null);
  const popupRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleResultClick = (index) => {
    setSelectedResult(index === selectedResult ? null : index);
  };

  const highlightDifferences = (actual, expected) => {
    const actualString = actual.toString();
    const expectedString = expected.toString();

    const diff = diffWords(expectedString, actualString);

    let highlightedExpected = '';
    let highlightedActual = '';

    diff.forEach(part => {
      if (part.removed) {
        highlightedExpected += `<span style="background-color: salmon;">${part.value}</span>`;
      } else if (part.added) {
        highlightedActual += `<span style="background-color: salmon;">${part.value}</span>`;
      } else {
        highlightedExpected += part.value;
        highlightedActual += part.value;
      }
    });

    return { highlightedExpected, highlightedActual };
  };

  return (
    <div className="popup">
      <div className="popup-content" ref={popupRef}>
        <h2>Test Results</h2>
        <button onClick={onClose} className="close-btn">X</button>
        <ul className="results-list">
          {results.map((result, index) => {
            const { highlightedExpected, highlightedActual } = highlightDifferences(result.actual, result.expected);

            return (
              <li key={index} className="result-item" onClick={() => handleResultClick(index)}>
                <div className={`result-summary ${result.passed ? 'passed' : 'failed'}`}>
                  <p>Test {index + 1}</p>
                  <p>{result.passed ? 'PASSED' : 'FAILED'}</p>
                </div>
                {selectedResult === index && (
                  <div className="result-details">
                    <p><strong>Inputs:</strong> {JSON.stringify(result.inputs)}</p>
                    <p><strong>Expected Output:</strong> <span dangerouslySetInnerHTML={{ __html: highlightedExpected }} /></p>
                    <p><strong>Actual Output:</strong> <span dangerouslySetInnerHTML={{ __html: highlightedActual }} /></p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default TestResultsPopup;
