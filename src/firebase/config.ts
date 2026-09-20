/**
 * Firebase Configuration & Initialization
 * Connected to AMIS Realtime Database & Auth
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
  apiKey: "AIzaSyCZkfu2HWeHFQoEBR775wRsM8jkCzLyLRQ",
  authDomain: "amis-d17f3.firebaseapp.com",
  databaseURL: "https://amis-d17f3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "amis-d17f3",
  storageBucket: "amis-d17f3.appspot.com",
  messagingSenderId: "456359958505",
  appId: "1:456359958505:web:c5ce9491958cbc3e659d78",
  measurementId: "G-4Z0T73Z48D"
};

// Singleton initialization
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const database = getDatabase(app);
