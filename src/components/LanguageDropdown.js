import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, getDoc, addDoc } from 'firebase/firestore';
import '../css/LanguageDropdown.css';

function LanguageDropdown({ uid }) {
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [offeredLanguages] = useState(["Java", "Python", "HTML/CSS"]);

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

      // Check if the selected language is already in programmingLanguages collection
      const languageExists = languages.some(lang => lang.name === language.name);

      // If the language does not exist, add it to the collection
      if (!languageExists) {
        await addDoc(collection(db, 'programmingLanguages'), { name: language.name });
        // Update the languages state with the new language
        const updatedLanguages = [...languages, { id: language.id, name: language.name }];
        setLanguages(updatedLanguages);
      }
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
        <div className="language-dropdown-content">
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
              onClick={() => handleLanguageChange({ id: language.id, name: language })}
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
