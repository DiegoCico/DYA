import React, { useEffect, useRef, useState } from 'react';
import '../css/Popup.css';
import { diffWords } from 'diff';

/**
 * TestResultsPopup Component
 *
 * This component displays a popup with the test results for code submissions. 
 * It highlights the differences between the expected and actual output for each test.
 *
 * Props:
 * - results (Array): An array of result objects containing the following keys:
 *   - inputs: The inputs used for the test case.
 *   - expected: The expected output for the test case.
 *   - actual: The actual output produced by the user's code.
 *   - passed: A boolean indicating whether the test passed or failed.
 * - onClose (Function): A function to close the popup.
 *
 * State:
 * - selectedResult (Number): The index of the currently selected test result.
 *
 * The component uses the `diffWords` function from the `diff` library to highlight differences
 * between the expected and actual outputs.
 */

function TestResultsPopup({ results, onClose }) {
  const [selectedResult, setSelectedResult] = useState(null);
  const popupRef = useRef(null);

  /**
   * Handles clicks outside the popup to close it.
   * 
   * @param {Event} event - The click event.
   */
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

  /**
   * Handles clicks on a test result to expand or collapse it.
   * 
   * @param {Number} index - The index of the clicked test result.
   */
  const handleResultClick = (index) => {
    setSelectedResult(index === selectedResult ? null : index);
  };

  /**
   * Highlights the differences between the actual and expected outputs.
   * 
   * @param {String} actual - The actual output.
   * @param {String} expected - The expected output.
   * @returns {Object} - An object containing the highlighted strings for expected and actual outputs.
   */
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
