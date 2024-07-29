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
    const tolerance = 1e-10; // Define a tolerance level for numerical comparison

    const actualNum = parseFloat(actual);
    const expectedNum = parseFloat(expected);

    console.log('Actual:', actual, 'Expected:', expected);
    console.log('Parsed Actual:', actualNum, 'Parsed Expected:', expectedNum);
    console.log('Difference:', Math.abs(actualNum - expectedNum));

    // Check if both actual and expected are numbers and within the tolerance
    if (!isNaN(actualNum) && !isNaN(expectedNum) && Math.abs(actualNum - expectedNum) < tolerance) {
      // If the values are numerically close, consider them equal
      console.log('Values are within tolerance, considered equal.');
      return (
        <span style={{ backgroundColor: 'lightgreen' }}>
          {actual.toString()}
        </span>
      );
    }

    console.log('Values are not within tolerance, highlighting differences.');
    // Perform string comparison if they are not within the tolerance
    const diff = diffWords(actual.toString(), expected.toString());
    return diff.map((part, index) => (
      <span key={index} style={{ backgroundColor: part.added ? 'lightgreen' : part.removed ? 'salmon' : 'transparent' }}>
        {part.value}
      </span>
    ));
  };

  return (
    <div className="popup">
      <div className="popup-content" ref={popupRef}>
        <h2>Test Results</h2>
        <button onClick={onClose} className="close-btn">X</button>
        <ul className="results-list">
          {results.map((result, index) => (
            <li key={index} className="result-item" onClick={() => handleResultClick(index)}>
              <div className={`result-summary ${result.passed ? 'passed' : 'failed'}`}>
                <p>Test {index + 1}</p>
                <p>{result.passed ? 'PASSED' : 'FAILED'}</p>
              </div>
              {selectedResult === index && (
                <div className="result-details">
                  <p><strong>Inputs:</strong> {JSON.stringify(result.inputs)}</p>
                  <p><strong>Expected:</strong> {highlightDifferences(result.expected, result.actual)}</p>
                  <p><strong>Actual:</strong> {highlightDifferences(result.actual, result.expected)}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TestResultsPopup;
