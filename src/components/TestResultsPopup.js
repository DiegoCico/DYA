import React, { useEffect, useRef } from 'react';
import '../css/Popup.css';

function TestResultsPopup({ results, onClose }) {
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

  return (
    <div className="popup">
      <div className="popup-content" ref={popupRef}>
        <h2>Test Results</h2>
        <button onClick={onClose} className="close-btn">X</button>
        <ul className="results-list">
          {results.map((result, index) => (
            <li key={index} className="result-item">
              <div className="result-inputs">
                <p><strong>Inputs:</strong> {JSON.stringify(result.inputs)}</p>
                <p><strong>Expected:</strong> {JSON.stringify(result.expected)}</p>
                <p><strong>Actual:</strong> {JSON.stringify(result.actual)}</p>
              </div>
              <div className={`result-status ${result.passed ? 'passed' : 'failed'}`}>
                <p>{result.passed ? 'PASSED' : 'FAILED'}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TestResultsPopup;
