import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
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

const initializeActivities = async () => {
  try {
    const activitiesCollection = collection(db, 'activities');
    const activitiesSnapshot = await getDocs(activitiesCollection);

    if (activitiesSnapshot.empty) {
      for (const activity of activitiesData.activities) {
        await addDoc(activitiesCollection, activity);
      }
      console.log('Activities initialized in Firestore');
    } else {
      console.log('Activities already initialized in Firestore');
    }
  } catch (error) {
    console.error('Error initializing activities:', error);
  }
};

initializeActivities();

export default app;
