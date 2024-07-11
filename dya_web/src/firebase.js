import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import activitiesData from './activities.json'; // Adjust the path as needed

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
    const activitiesSnapshot = await getDocs(activitiesCollection);

    if (activitiesSnapshot.empty) {
      // Add activities from the JSON file with an explicit order field
      const addPromises = activitiesData.activities.map((activity, index) => {
        const activityWithOrder = { ...activity, order: index };
        return addDoc(activitiesCollection, activityWithOrder);
      });
      await Promise.all(addPromises);
      console.log('Activities added to Firestore');
    } else {
      console.log('Activities already exist in Firestore');
    }
  } catch (error) {
    console.error('Error initializing activities:', error);
  }
};

export default app;
