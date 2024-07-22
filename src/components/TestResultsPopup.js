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
              {result.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TestResultsPopup;
