const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, deleteDoc } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteTestProfiles() {
  try {
    const profilesRef = collection(db, 'profiles');
    const snapshot = await getDocs(profilesRef);
    
    let deletedCount = 0;
    
    for (const doc of snapshot.docs) {
      if (doc.id.startsWith('TEST_')) {
        await deleteDoc(doc.ref);
        deletedCount++;
        console.log(`Deleted test profile: ${doc.id}`);
      }
    }
    
    console.log(`Successfully deleted ${deletedCount} test profiles`);
  } catch (error) {
    console.error('Error deleting test profiles:', error);
  }
}

// Run the script
deleteTestProfiles(); 