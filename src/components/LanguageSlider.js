import React, { useState } from 'react';
import '../css/LanguageSlider.css';

const languages = [
  { name: 'Java', image: `${process.env.PUBLIC_URL}/java.png`, info: 'Learn Java with fun activities and games.' },
  { name: 'Python', image: `${process.env.PUBLIC_URL}/python.png`, info: 'Learn Python with fun activities and games.' },
  { name: 'HTML/CSS', image: `${process.env.PUBLIC_URL}/html.png`, info: 'Learn HTML/CSS with fun activities and games.' },
  // Add more languages as needed
];

export default function LanguageSlider() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
  };

  const closePopup = () => {
    setSelectedLanguage(null);
  };

  return (
    <section className="language-slider">
      <h2>Languages We Offer</h2>
      <div className="slider">
        {languages.map((language, index) => (
          <div key={index} className="language-card" onClick={() => handleLanguageClick(language)}>
            <img src={language.image} alt={language.name} className="language-image" />
            <h3>{language.name}</h3>
          </div>
        ))}
      </div>
      {selectedLanguage && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedLanguage.name}</h3>
            <p>{selectedLanguage.info}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
