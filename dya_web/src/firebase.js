import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
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

    const existingActivities = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Check if activities need to be updated
    const activitiesToUpdate = activitiesData.activities.filter(activity => {
      return !existingActivities.some(existing => existing.title === activity.title && JSON.stringify(existing) === JSON.stringify(activity));
    });

    if (activitiesToUpdate.length > 0) {
      // Delete all existing activities
      await Promise.all(existingActivities.map(async (activity) => {
        await deleteDoc(doc(db, 'activities', activity.id));
      }));

      // Add updated activities
      await Promise.all(activitiesData.activities.map(async (activity) => {
        await addDoc(activitiesCollection, activity);
      }));

      console.log('Activities updated in Firestore');
    } else {
      console.log('Activities already up to date in Firestore');
    }
  } catch (error) {
    console.error('Error updating activities:', error);
  }
};

initializeActivities();

export default app;
