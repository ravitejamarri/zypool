// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC1GsHrGntlfXGUszDQXwuXnrhcNSnIDjI",
  authDomain: "zypool.firebaseapp.com",
  projectId: "zypool",
  storageBucket: "zypool.appspot.com",
  messagingSenderId: "73904126687",
  appId: "1:73904126687:web:3da3a1da410f9413b8c76a",
  measurementId: "G-79T3GGF5BM"
};

const app = initializeApp(firebaseConfig);

// Fix: Use persistent auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
