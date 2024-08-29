import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, getDoc } from 'firebase/firestore';
import '../css/LanguageDropdown.css';

/**
 * LanguageDropdown Component
 * 
 * This component allows users to select and switch between different programming languages in their learning dashboard.
 * The currently selected language is stored in the user's document in Firestore, and the component also updates the user's
 * progress in that language.
 * 
 * Props:
 * - uid: The unique ID of the user currently logged in.
 * - onLanguageChange: A callback function that triggers when the user selects a different language.
 * 
 * State:
 * - languages: An array of available programming languages fetched from Firestore.
 * - currentLanguage: The language currently selected by the user.
 * - dropdownOpen: A boolean indicating whether the dropdown menu is open.
 * - offeredLanguages: A list of default languages offered by the platform (Java, Python, JavaScript).
 * 
 * useRef:
 * - dropdownRef: A reference to the dropdown menu element, used for positioning adjustments.
 */

function LanguageDropdown({ uid, onLanguageChange }) {
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [offeredLanguages] = useState(["Java", "Python", "JavaScript"]);
  const dropdownRef = useRef(null);

  /**
   * useEffect Hook
   * 
   * Fetches the user's current language and the list of available languages from Firestore when the component mounts.
   * 
   * Dependencies: uid
   */
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();

        const languagesCollection = collection(db, 'programmingLanguages');
        const languagesQuery = query(languagesCollection, orderBy('name'));
        const languagesSnapshot = await getDocs(languagesQuery);
        const languagesData = languagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setCurrentLanguage(userData.currentLanguage);
        setLanguages(languagesData);
      } catch (err) {
        console.error('Error fetching languages:', err);
      }
    };

    fetchLanguages();
  }, [uid]);

  /**
   * useEffect Hook
   * 
   * Adjusts the positioning of the dropdown menu if it exceeds the viewport boundaries.
   * 
   * Dependencies: dropdownOpen
   */
  useEffect(() => {
    if (dropdownOpen && dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      if (dropdownRect.right > window.innerWidth) {
        dropdownRef.current.style.left = 'auto';
        dropdownRef.current.style.right = '0';
      }
      if (dropdownRect.bottom > window.innerHeight) {
        dropdownRef.current.style.top = 'auto';
        dropdownRef.current.style.bottom = '100%';
      }
    }
  }, [dropdownOpen]);

  /**
   * handleLanguageChange
   * 
   * Updates the user's selected language in Firestore, along with their progress in that language.
   * The current language is updated locally, and the dropdown menu is closed.
   * 
   * @param {Object} language - The selected language object containing `id` and `name`.
   */
  const handleLanguageChange = async (language) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();

      const currentActivityForLang = userData.programmingLanguages.find((lang) => lang.langName === language.name)?.currentActivity || 0;

      const updatedProgrammingLanguages = userData.programmingLanguages
        ? [
          ...userData.programmingLanguages.filter(
            (lang) => lang.langName !== language.name
          ),
          { langName: language.name, currentActivity: currentActivityForLang },
        ]
        : [{ langName: language.name, currentActivity: 0 }];

      await updateDoc(userDocRef, {
        currentLanguage: language.name,
        currentActivity: currentActivityForLang,
        programmingLanguages: updatedProgrammingLanguages,
      });
      setCurrentLanguage(language.name);
      setDropdownOpen(false);
      onLanguageChange(language.name); 
      window.location.reload();
    } catch (err) {
      console.error('Error updating language:', err);
    }
  };

  return (
    <div className="language-dropdown">
      <button onClick={() => setDropdownOpen(!dropdownOpen)}>
        {currentLanguage ? currentLanguage : 'Select Language'}
      </button>
      {dropdownOpen && (
        <div ref={dropdownRef} className="language-dropdown-content">
          {languages.map(language => (
            <div
              key={language.id}
              className={`language-item ${language.name === currentLanguage ? 'current' : ''}`}
              onClick={() => handleLanguageChange(language)}
            >
              {language.name}
            </div>
          ))}
          <hr />
          {offeredLanguages.map((language, index) => (
            <div
              key={index}
              className={`language-item ${language === currentLanguage ? 'current' : ''}`}
              onClick={() => handleLanguageChange({ id: index, name: language })}
            >
              {language}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageDropdown;
