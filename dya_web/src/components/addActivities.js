// DOESNT DO ANYTHING RN

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, setDoc, doc } = require('firebase/firestore');
const activities = require('./activities.json');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI37lzWhWSv7VQif5mlNbZm0Bso5W05OA",
  authDomain: "dyakidswebsite-ab5f1.firebaseapp.com",
  projectId: "dyakidswebsite-ab5f1",
  storageBucket: "dyakidswebsite-ab5f1.appspot.com",
  messagingSenderId: "79577052767",
  appId: "1:79577052767:web:c68ca99c2a73b59f5ecdea",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addActivities = async () => {
  try {
    const activitiesCollection = collection(db, 'activities');
    for (const [index, activity] of activities.entries()) {
      await setDoc(doc(activitiesCollection, `activity${index + 1}`), activity);
    }
    console.log('Activities added successfully!');
  } catch (error) {
    console.error('Error adding activities: ', error);
  }
};

addActivities();
