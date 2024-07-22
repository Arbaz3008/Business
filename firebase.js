import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from 'firebase/database';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyCQwXWSQdCH9XPdt1ogjGDhVs_3al86rT4",
  authDomain: "business-bf4d2.firebaseapp.com",
  projectId: "business-bf4d2",
  storageBucket: "business-bf4d2.appspot.com",
  messagingSenderId: "217214928700",
  appId: "1:217214928700:web:8c28330c40d13529ac8039",
  measurementId: "G-DBH73FQEL5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const database = getDatabase(app);
 export const auth = getAuth(app);
 export const firestore = db;

