import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage
import activitiesDataPython from './activitiesPython.json';
import lessonsDataPython from './lessonsPython.json'; 

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
export const storage = getStorage(app); // Initialize and export Firebase Storage

export const initializeActivities = async () => {
  try {
    const activitiesCollection = collection(db, 'activities');

    // Fetch all existing activities
    const activitiesSnapshot = await getDocs(activitiesCollection);
    console.log(`Found ${activitiesSnapshot.docs.length} existing activities. Deleting them...`);

    const deletePromises = activitiesSnapshot.docs.map(doc => deleteDoc(doc.ref));

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);

    console.log('All existing activities deleted');

    // Add activities from JSON with order field starting from 1
    const addPromises = activitiesDataPython.activities.map((activity, index) => {
      const activityWithOrder = { ...activity, order: index };
      return addDoc(activitiesCollection, activityWithOrder);
    });

    await Promise.all(addPromises);

    console.log('New activities added to Firestore');
  } catch (error) {
    console.error('Error initializing activities:', error);
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

initializeActivities();
initializeLessons();

export default app;
