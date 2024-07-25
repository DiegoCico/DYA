import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, getDoc } from 'firebase/firestore';
import '../css/LanguageDropdown.css';

function LanguageDropdown({ uid }) {
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [offeredLanguages] = useState(["Java", "Python", "HTML/CSS"]);
  const dropdownRef = useRef(null);

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

  const handleLanguageChange = async (language) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      
      const updatedProgrammingLanguages = userData.programmingLanguages
        ? [...new Set([...userData.programmingLanguages, language.name])]
        : [language.name];

      await updateDoc(userDocRef, {
        currentLanguage: language.name,
        programmingLanguages: updatedProgrammingLanguages,
      });
      setCurrentLanguage(language.name);
      setDropdownOpen(false);
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
