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

// Debug: Log full config (without sensitive values)
console.log('[Firebase] Configuration:', {
  hasApiKey: !!firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
  hasMeasurementId: !!firebaseConfig.measurementId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// More detailed initialization logging
console.log('[Firebase] Detailed initialization status:', {
  app: {
    name: app.name,
    options: app.options,
    automaticDataCollectionEnabled: app.automaticDataCollectionEnabled
  },
  auth: {
    initialized: !!auth,
    currentUser: auth.currentUser,
    languageCode: auth.languageCode
  },
  storage: {
    initialized: !!storage,
    bucket: storage?.app?.options?.storageBucket
  }
});

// Export all services
export { app, auth, db, storage, googleProvider };

export const actionCodeSettings = {
  url: 'https://wearegeniuses.com/reset-password',
  handleCodeInApp: true
};

export const sendPasswordResetWithConfig = (email) => {
  return sendPasswordResetEmail(auth, email, actionCodeSettings);
};

// Final initialization check
const services = {
  app: !!app,
  auth: !!auth,
  db: !!db,
  storage: !!storage
};

console.log('[Firebase] Services initialization status:', services);

if (!Object.values(services).every(Boolean)) {
  console.error('[Firebase] Some services failed to initialize:', 
    Object.entries(services)
      .filter(([_, initialized]) => !initialized)
      .map(([service]) => service)
  );
}