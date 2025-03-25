const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc } = require('firebase/firestore');
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

const testProfiles = [
  {
    displayName: "TEST_John Smith",
    countryOfResidence: "United States",
    aboutWorkWithJoe: "I've been practicing Dr. Joe's teachings for 3 years, focusing on meditation and personal transformation.",
    businesses: [
      {
        name: "Mindful Wellness Center",
        headline: "Holistic Health & Wellness Services",
        description: "Offering meditation classes, energy healing, and wellness coaching.",
        logo: { url: "https://via.placeholder.com/150" },
        category: "Wellness"
      },
      {
        name: "Transformational Coaching",
        headline: "Personal Development & Life Coaching",
        description: "One-on-one coaching sessions focused on personal growth and transformation.",
        logo: { url: "https://via.placeholder.com/150" },
        category: "Education"
      }
    ]
  },
  {
    displayName: "TEST_Sarah Johnson",
    countryOfResidence: "United Kingdom",
    aboutWorkWithJoe: "Certified meditation instructor and energy healer, incorporating Dr. Joe's teachings into my practice.",
    businesses: [
      {
        name: "Energy Healing Studio",
        headline: "Energy Healing & Meditation",
        description: "Professional energy healing services and guided meditation sessions.",
        logo: { url: "https://via.placeholder.com/150" },
        category: "Wellness"
      }
    ]
  },
  {
    displayName: "TEST_Michael Chen",
    countryOfResidence: "Canada",
    aboutWorkWithJoe: "Tech entrepreneur integrating Dr. Joe's principles into business leadership.",
    businesses: [
      {
        name: "TechMind Solutions",
        headline: "Technology & Mindfulness Integration",
        description: "Developing apps and tools for meditation and personal development.",
        logo: { url: "https://via.placeholder.com/150" },
        category: "Technology"
      },
      {
        name: "Mindful Leadership Academy",
        headline: "Business Leadership Training",
        description: "Training programs combining traditional business skills with mindfulness practices.",
        logo: { url: "https://via.placeholder.com/150" },
        category: "Business"
      }
    ]
  },
  {
    displayName: "TEST_Emma Wilson",
    countryOfResidence: "Australia",
    aboutWorkWithJoe: "Healthcare professional incorporating Dr. Joe's teachings into patient care.",
    businesses: [
      {
        name: "Holistic Health Clinic",
        headline: "Integrative Healthcare Services",
        description: "Combining traditional medicine with holistic healing approaches.",
        logo: { url: "https://via.placeholder.com/150" },
        category: "Healthcare"
      }
    ]
  },
  {
    displayName: "TEST_David Brown",
    countryOfResidence: "United States",
    aboutWorkWithJoe: "Artist and creative coach using Dr. Joe's principles in artistic expression.",
    businesses: [
      {
        name: "Creative Spirit Studio",
        headline: "Art & Creativity Coaching",
        description: "Art workshops and creative coaching sessions.",
        logo: { url: "https://via.placeholder.com/150" },
        category: "Arts"
      }
    ]
  },
  {
    displayName: "TEST_Lisa Anderson",
    countryOfResidence: "New Zealand",
    aboutWorkWithJoe: "Financial advisor integrating mindfulness into financial planning.",
    businesses: [
      {
        name: "Mindful Wealth Management",
        headline: "Conscious Financial Planning",
        description: "Financial planning services with a focus on conscious wealth creation.",
        logo: { url: "https://via.placeholder.com/150" },
        category: "Finance"
      }
    ]
  },
  {
    displayName: "TEST_Robert Martinez",
    countryOfResidence: "Spain",
    aboutWorkWithJoe: "Community organizer creating spaces for meditation and personal growth.",
    businesses: [
      {
        name: "Community Wellness Hub",
        headline: "Community Center & Wellness Programs",
        description: "Community center offering various wellness programs and meditation classes.",
        logo: { url: "https://via.placeholder.com/150" },
        category: "Community"
      }
    ]
  },
  {
    displayName: "TEST_Sophie Taylor",
    countryOfResidence: "France",
    aboutWorkWithJoe: "Educator incorporating Dr. Joe's teachings into modern education.",
    businesses: [
      {
        name: "Mindful Education Center",
        headline: "Conscious Education Programs",
        description: "Educational programs that integrate mindfulness and personal development.",
        logo: { url: "https://via.placeholder.com/150" },
        category: "Education"
      }
    ]
  },
  {
    displayName: "TEST_James Wilson",
    countryOfResidence: "Ireland",
    aboutWorkWithJoe: "Retreat facilitator organizing transformative experiences.",
    businesses: [
      {
        name: "Transformational Retreats",
        headline: "Meditation & Personal Growth Retreats",
        description: "Organizing retreats focused on meditation and personal transformation.",
        logo: { url: "https://via.placeholder.com/150" },
        category: "Wellness"
      }
    ]
  },
  {
    displayName: "TEST_Maria Garcia",
    countryOfResidence: "Portugal",
    aboutWorkWithJoe: "Yoga instructor combining Dr. Joe's teachings with yoga practice.",
    businesses: [
      {
        name: "Conscious Yoga Studio",
        headline: "Yoga & Meditation Center",
        description: "Yoga classes and meditation sessions in a peaceful environment.",
        logo: { url: "https://via.placeholder.com/150" },
        category: "Wellness"
      }
    ]
  }
];

async function createTestProfiles() {
  try {
    for (const profile of testProfiles) {
      // Create a new document with a custom ID (using TEST_ prefix)
      const docId = `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const docRef = doc(db, 'profiles', docId);
      
      // Add the profile data
      await setDoc(docRef, {
        ...profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log(`Created test profile: ${profile.displayName}`);
    }
    
    console.log('All test profiles created successfully!');
  } catch (error) {
    console.error('Error creating test profiles:', error);
  }
}

// Run the script
createTestProfiles(); 