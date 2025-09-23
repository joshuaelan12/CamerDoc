import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-8874615456-3dcec",
  "appId": "1:678938621299:web:8ce5f3a8691413f0820106",
  "apiKey": "AIzaSyAIDKCx9Zck6Rk-K-KJmU9fiwTloaUrDYo",
  "authDomain": "studio-8874615456-3dcec.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "678938621299"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
