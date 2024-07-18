import React from 'react';
import '../css/MascotSection.css';

export default function MascotSection() {
  return (
    <section className="mascot-section">
      <h2>Why You Should Learn With Us</h2>
      <div className="mascot-content">
        <img src="mascot.png" alt="Mascot" className="mascot-image" />
        <ul className="reasons-list">
          <li>Interactive and fun learning experiences</li>
          <li>Personalized learning paths</li>
          <li>Expertly crafted educational content</li>
          <li>Safe and child-friendly environment</li>
          <li>Supportive community of learners</li>
        </ul>
      </div>
    </section>
  );
}
