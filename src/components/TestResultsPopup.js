import React from 'react';
import '../css/Popup.css';

function TestResultsPopup({ results, onClose }) {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Test Results</h2>
        <button onClick={onClose} className="close-btn">X</button>
        <ul>
          {results.map((result, index) => (
            <li key={index} style={{ color: result.passed ? 'green' : 'red' }}>
              <p>{result.message}</p>
              <p><strong>Inputs:</strong> {JSON.stringify(result.inputs)}</p>
              <p><strong>Expected Output:</strong> {JSON.stringify(result.expected)}</p>
              <p><strong>Actual Output:</strong> {JSON.stringify(result.actual)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TestResultsPopup;
