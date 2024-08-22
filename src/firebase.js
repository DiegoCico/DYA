import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 
import activitiesDataPython from './activitiesPython.json';
import lessonsDataPython from './lessonsPython.json';
import activitiesDataJava from './activitiesJava.json';
import activitiesDataJavaScript from './activitiesJavaScript.json'; 

const firebaseConfig = {
  apiKey: "AIzaSyBI37lzWhWSv7VQif5mlNbZm0Bso5W05OA",
  authDomain: "dyakidswebsite-ab5f1.firebaseapp.com",
  projectId: "dyakidswebsite-ab5f1",
  storageBucket: "dyakidswebsite-ab5f1.appspot.com",
  messagingSenderId: "79577052767",
  appId: "1:79577052767:web:c68ca99c2a73b59f5ecdea",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 

export const initializeActivitiesPython = async () => {
  try {
    const activitiesCollection = collection(db, 'activitiesPython');

    // Fetch all existing Python activities
    const activitiesSnapshot = await getDocs(activitiesCollection);
    console.log(`Found ${activitiesSnapshot.docs.length} existing Python activities. Deleting them...`);

    const deletePromises = activitiesSnapshot.docs.map(doc => deleteDoc(doc.ref));

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);

    console.log('All existing Python activities deleted');

    // Add activities from Python JSON with order field starting from 1
    const addPromises = activitiesDataPython.activities.map((activity, index) => {
      const activityWithOrder = { ...activity, order: index };
      return addDoc(activitiesCollection, activityWithOrder);
    });

    await Promise.all(addPromises);

    console.log('New Python activities added to Firestore');
  } catch (error) {
    console.error('Error initializing Python activities:', error);
  }
};

export const initializeActivitiesJava = async () => {
  try {
    const activitiesCollection = collection(db, 'activitiesJava');

    // Fetch all existing Java activities
    const activitiesSnapshot = await getDocs(activitiesCollection);
    console.log(`Found ${activitiesSnapshot.docs.length} existing Java activities. Deleting them...`);

    const deletePromises = activitiesSnapshot.docs.map(doc => deleteDoc(doc.ref));

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);

    console.log('All existing Java activities deleted');

    // Add activities from Java JSON with order field starting from 1
    const addPromises = activitiesDataJava.activities.map((activity, index) => {
      const activityWithOrder = { ...activity, order: index };
      return addDoc(activitiesCollection, activityWithOrder);
    });

    await Promise.all(addPromises);

    console.log('New Java activities added to Firestore');
  } catch (error) {
    console.error('Error initializing Java activities:', error);
  }
};

export const initializeActivitiesJavaScript = async () => {
  try {
    const activitiesCollection = collection(db, 'activitiesJavaScript');

    // Fetch all existing JavaScript activities
    const activitiesSnapshot = await getDocs(activitiesCollection);
    console.log(`Found ${activitiesSnapshot.docs.length} existing JavaScript activities. Deleting them...`);

    const deletePromises = activitiesSnapshot.docs.map(doc => deleteDoc(doc.ref));

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);

    console.log('All existing JavaScript activities deleted');

    // Add activities from JavaScript JSON with order field starting from 1
    const addPromises = activitiesDataJavaScript.activities.map((activity, index) => {
      const activityWithOrder = { ...activity, order: index };
      return addDoc(activitiesCollection, activityWithOrder);
    });

    await Promise.all(addPromises);

    console.log('New JavaScript activities added to Firestore');
  } catch (error) {
    console.error('Error initializing JavaScript activities:', error);
  }
};

export const initializeLessons = async () => {
  try {
    const lessonsCollection = collection(db, 'LessonPython');

    // Fetch all existing lessons
    const lessonsSnapshot = await getDocs(lessonsCollection);
    console.log(`Found ${lessonsSnapshot.docs.length} existing lessons. Deleting them...`);

    const deletePromises = lessonsSnapshot.docs.map(doc => deleteDoc(doc.ref));

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);

    console.log('All existing lessons deleted');

    // Add lessons from JSON with order field starting from 1
    const addPromises = lessonsDataPython.lessons.map((lesson, index) => {
      const lessonWithOrder = { ...lesson, order: index };
      return addDoc(lessonsCollection, lessonWithOrder);
    });

    await Promise.all(addPromises);

    console.log('New lessons added to Firestore');
  } catch (error) {
    console.error('Error initializing lessons:', error);
  }
};

// initializeActivitiesPython();
// initializeActivitiesJava();
// initializeActivitiesJavaScript(); 
// initializeLessons();

export default app;
