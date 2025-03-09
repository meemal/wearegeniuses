import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Export all services
export { auth, db, storage, googleProvider };

// Debug logging for Firebase initialization
console.log('[Firebase] Checking initialization status:', {
  auth: !!auth,
  db: !!db,
  storage: !!storage,
  config: {
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
  }
});

if (!storage) {
  console.error('[Firebase] Storage failed to initialize');
}

export const actionCodeSettings = {
  url: 'https://wearegeniuses.com/reset-password',
  handleCodeInApp: true
};

export const sendPasswordResetWithConfig = (email) => {
  return sendPasswordResetEmail(auth, email, actionCodeSettings);
};

export default app;