import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';

const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_ID = import.meta.env.VITE_FIREBASE_MESSAGING_ID;
const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID;

const FIRESTORE_COLLECTION = import.meta.env.VITE_FIRESTORE_COLLECTION;

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_ID,
    appId: FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, FIRESTORE_COLLECTION);
