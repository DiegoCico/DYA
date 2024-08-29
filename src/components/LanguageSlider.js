import React, { useState } from 'react';
import '../css/LanguageSlider.css';

/**
 * LanguageSlider Component
 * 
 * The `LanguageSlider` component showcases the various programming languages offered on the platform.
 * Each language is displayed as a card in a horizontal slider. When a language card is clicked, a popup 
 * appears with additional information about the selected language.
 * 
 * State:
 * - selectedLanguage: The language currently selected by the user. If null, no popup is shown.
 * 
 * Functions:
 * - handleLanguageClick: Handles the selection of a language card and opens the popup.
 * - closePopup: Closes the language information popup.
 */

const languages = [
  { name: 'Java', image: `${process.env.PUBLIC_URL}/java.png`, info: 'Learn Java with fun activities and games.' },
  { name: 'Python', image: `${process.env.PUBLIC_URL}/python.png`, info: 'Learn Python with fun activities and games.' },
  { name: 'JavaScript', image: `${process.env.PUBLIC_URL}/js-icon.png`, info: 'Learn HTML/CSS with fun activities and games.' },
  // Add more languages as needed
];

export default function LanguageSlider() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  /**
   * handleLanguageClick
   * 
   * Opens the popup with information about the selected language.
   * 
   * @param {Object} language - The language object containing the name, image, and info.
   */
  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
  };

  /**
   * closePopup
   * 
   * Closes the language information popup.
   */
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
