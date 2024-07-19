import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import activitiesData from './activities.json';

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
    const addPromises = activitiesData.activities.map((activity, index) => {
      const activityWithOrder = { ...activity, order: index };
      return addDoc(activitiesCollection, activityWithOrder);
    });

    await Promise.all(addPromises);

    console.log('New activities added to Firestore');
  } catch (error) {
    console.error('Error initializing activities:', error);
  }
};

initializeActivities();

export default app;
