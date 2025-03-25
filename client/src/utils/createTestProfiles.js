import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const businessCategories = [
  'Wellness & Health',
  'Coaching & Mentoring',
  'Healing & Energy Work',
  'Education & Training',
  'Meditation & Mindfulness',
  'Holistic Health',
  'Personal Development',
  'Alternative Medicine'
];

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Netherlands',
  'Switzerland',
  'New Zealand'
];

const testProfiles = [
  {
    displayName: 'TEST_Sarah Johnson',
    countryOfResidence: 'United States',
    aboutWorkWithJoe: 'Test profile - Certified meditation instructor and wellness coach with 5 years of experience in Dr Joe\'s work.',
    hopingToConnectWith: 'Fellow practitioners interested in combining meditation with holistic healing practices.',
    eventsAttended: [
      { name: 'Week Long Advanced Retreat - Marco Island 2023' },
      { name: 'Progressive Workshop - Barcelona 2024' }
    ],
    businesses: [
      {
        name: 'TEST_Mindful Transformations',
        headline: 'Guiding You to Your Highest Potential',
        category: 'Coaching & Mentoring',
        description: 'Specialized coaching services combining Dr Joe\'s teachings with practical life strategies.',
        logo: { url: 'https://ui-avatars.com/api/?name=MT&background=random' },
        socialAddresses: {
          website: 'https://example.com',
          linkedin: 'https://linkedin.com'
        }
      },
      {
        name: 'TEST_Wellness Warriors',
        headline: 'Holistic Health & Meditation',
        category: 'Wellness & Health',
        description: 'Group meditation sessions and wellness workshops based on Dr Joe\'s principles.',
        logo: { url: 'https://ui-avatars.com/api/?name=WW&background=random' }
      }
    ]
  },
  {
    displayName: 'TEST_Michael Chen',
    countryOfResidence: 'Canada',
    aboutWorkWithJoe: 'Test profile - Energy healer and meditation guide, practicing Dr Joe\'s methods since 2019.',
    hopingToConnectWith: 'Practitioners interested in energy work and quantum healing.',
    eventsAttended: [
      { name: 'Week Long Advanced Retreat - Cancun 2023' }
    ],
    businesses: [
      {
        name: 'TEST_Quantum Healing Arts',
        headline: 'Bridge Science and Spirit',
        category: 'Healing & Energy Work',
        description: 'Specialized energy healing sessions incorporating quantum principles and meditation.',
        logo: { url: 'https://ui-avatars.com/api/?name=QH&background=random' },
        socialAddresses: {
          youtube: 'https://youtube.com',
          facebook: 'https://facebook.com'
        }
      },
      {
        name: 'TEST_Mind-Body Integration',
        headline: 'Holistic Wellness Through Meditation',
        category: 'Meditation & Mindfulness',
        description: 'Personalized meditation coaching and energy alignment sessions.',
        logo: { url: 'https://ui-avatars.com/api/?name=MB&background=random' }
      }
    ]
  },
  {
    displayName: 'TEST_Emma Thompson',
    countryOfResidence: 'United Kingdom',
    aboutWorkWithJoe: 'Test profile - Holistic health practitioner and meditation teacher since 2018.',
    hopingToConnectWith: 'Like-minded individuals focused on personal transformation and healing.',
    eventsAttended: [
      { name: 'Week Long Advanced Retreat - Mexico 2023' },
      { name: 'Progressive Workshop - London 2024' }
    ],
    businesses: [
      {
        name: 'TEST_Inner Alchemy',
        headline: 'Transform Your Life Through Meditation',
        category: 'Meditation & Mindfulness',
        description: 'Guided meditation sessions and workshops focused on personal transformation.',
        logo: { url: 'https://ui-avatars.com/api/?name=IA&background=random' },
        socialAddresses: {
          website: 'https://example.com',
          youtube: 'https://youtube.com'
        }
      },
      {
        name: 'TEST_Holistic Healing Hub',
        headline: 'Integrated Wellness Solutions',
        category: 'Holistic Health',
        description: 'Combining traditional healing practices with modern wellness approaches.',
        logo: { url: 'https://ui-avatars.com/api/?name=HH&background=random' }
      }
    ]
  },
  {
    displayName: 'TEST_David Anderson',
    countryOfResidence: 'Australia',
    aboutWorkWithJoe: 'Test profile - Personal development coach specializing in Dr Joe\'s methods.',
    hopingToConnectWith: 'Coaches and practitioners interested in combining business with spirituality.',
    eventsAttended: [
      { name: 'Week Long Advanced Retreat - Cancun 2024' }
    ],
    businesses: [
      {
        name: 'TEST_Quantum Success Coaching',
        headline: 'Align Your Business with Your Higher Purpose',
        category: 'Coaching & Mentoring',
        description: 'Business coaching infused with spiritual principles and meditation practices.',
        logo: { url: 'https://ui-avatars.com/api/?name=QS&background=random' },
        socialAddresses: {
          linkedin: 'https://linkedin.com',
          facebook: 'https://facebook.com'
        }
      },
      {
        name: 'TEST_Mindful Leadership Academy',
        headline: 'Developing Conscious Leaders',
        category: 'Education & Training',
        description: 'Training programs for business leaders incorporating meditation and mindfulness.',
        logo: { url: 'https://ui-avatars.com/api/?name=ML&background=random' }
      }
    ]
  },
  {
    displayName: 'TEST_Sofia Rodriguez',
    countryOfResidence: 'Spain',
    aboutWorkWithJoe: 'Test profile - Energy healer and meditation facilitator with extensive retreat experience.',
    hopingToConnectWith: 'Energy workers and healers interested in collaborative projects.',
    eventsAttended: [
      { name: 'Week Long Advanced Retreat - Italy 2023' },
      { name: 'Progressive Workshop - Barcelona 2024' }
    ],
    businesses: [
      {
        name: 'TEST_Sacred Energy Healing',
        headline: 'Connect with Your Inner Healer',
        category: 'Healing & Energy Work',
        description: 'Personalized energy healing sessions and group healing circles.',
        logo: { url: 'https://ui-avatars.com/api/?name=SE&background=random' },
        socialAddresses: {
          website: 'https://example.com',
          instagram: 'https://instagram.com'
        }
      },
      {
        name: 'TEST_Meditation Journeys',
        headline: 'Guide Your Inner Transformation',
        category: 'Meditation & Mindfulness',
        description: 'Guided meditation experiences and transformational retreats.',
        logo: { url: 'https://ui-avatars.com/api/?name=MJ&background=random' }
      }
    ]
  },
  {
    displayName: 'TEST_Hans Weber',
    countryOfResidence: 'Germany',
    aboutWorkWithJoe: 'Test profile - Alternative medicine practitioner integrating Dr Joe\'s teachings.',
    hopingToConnectWith: 'Healthcare professionals interested in holistic approaches.',
    eventsAttended: [
      { name: 'Week Long Advanced Retreat - Switzerland 2023' }
    ],
    businesses: [
      {
        name: 'TEST_Integrative Wellness Center',
        headline: 'Bridging Traditional and Modern Medicine',
        category: 'Alternative Medicine',
        description: 'Holistic healthcare combining various healing modalities with meditation.',
        logo: { url: 'https://ui-avatars.com/api/?name=IW&background=random' },
        socialAddresses: {
          website: 'https://example.com'
        }
      },
      {
        name: 'TEST_Mind-Body Healing Institute',
        headline: 'Scientific Approach to Holistic Health',
        category: 'Education & Training',
        description: 'Training programs for healthcare professionals in mind-body medicine.',
        logo: { url: 'https://ui-avatars.com/api/?name=MB&background=random' }
      }
    ]
  },
  {
    displayName: 'TEST_Marie Laurent',
    countryOfResidence: 'France',
    aboutWorkWithJoe: 'Test profile - Wellness coach and meditation instructor since 2020.',
    hopingToConnectWith: 'Wellness professionals interested in group programs.',
    eventsAttended: [
      { name: 'Progressive Workshop - Paris 2023' },
      { name: 'Week Long Advanced Retreat - Spain 2024' }
    ],
    businesses: [
      {
        name: 'TEST_Vital Balance Wellness',
        headline: 'Achieve Your Optimal Wellbeing',
        category: 'Wellness & Health',
        description: 'Comprehensive wellness programs combining nutrition, meditation, and lifestyle coaching.',
        logo: { url: 'https://ui-avatars.com/api/?name=VB&background=random' },
        socialAddresses: {
          website: 'https://example.com',
          youtube: 'https://youtube.com'
        }
      },
      {
        name: 'TEST_Mindful Living Academy',
        headline: 'Transform Your Daily Life',
        category: 'Personal Development',
        description: 'Practical courses on incorporating mindfulness into everyday life.',
        logo: { url: 'https://ui-avatars.com/api/?name=ML&background=random' }
      }
    ]
  },
  {
    displayName: 'TEST_Anna van der Berg',
    countryOfResidence: 'Netherlands',
    aboutWorkWithJoe: 'Test profile - Personal transformation coach and retreat facilitator.',
    hopingToConnectWith: 'Fellow coaches and retreat organizers.',
    eventsAttended: [
      { name: 'Week Long Advanced Retreat - Greece 2023' }
    ],
    businesses: [
      {
        name: 'TEST_Transformational Journeys',
        headline: 'Your Path to Personal Evolution',
        category: 'Personal Development',
        description: 'Transformational retreats and coaching programs.',
        logo: { url: 'https://ui-avatars.com/api/?name=TJ&background=random' },
        socialAddresses: {
          website: 'https://example.com',
          instagram: 'https://instagram.com'
        }
      },
      {
        name: 'TEST_Conscious Living Hub',
        headline: 'Live with Purpose and Awareness',
        category: 'Coaching & Mentoring',
        description: 'Group coaching and workshops for conscious living.',
        logo: { url: 'https://ui-avatars.com/api/?name=CL&background=random' }
      }
    ]
  },
  {
    displayName: 'TEST_Thomas Mueller',
    countryOfResidence: 'Switzerland',
    aboutWorkWithJoe: 'Test profile - Corporate mindfulness trainer and meditation teacher.',
    hopingToConnectWith: 'Corporate trainers and business professionals.',
    eventsAttended: [
      { name: 'Progressive Workshop - Munich 2023' },
      { name: 'Week Long Advanced Retreat - Italy 2024' }
    ],
    businesses: [
      {
        name: 'TEST_Corporate Consciousness',
        headline: 'Bringing Mindfulness to Business',
        category: 'Education & Training',
        description: 'Corporate training programs focusing on mindfulness and stress management.',
        logo: { url: 'https://ui-avatars.com/api/?name=CC&background=random' },
        socialAddresses: {
          linkedin: 'https://linkedin.com',
          website: 'https://example.com'
        }
      },
      {
        name: 'TEST_Executive Wellness Institute',
        headline: 'Leadership Through Mindfulness',
        category: 'Coaching & Mentoring',
        description: 'Executive coaching combining business excellence with personal wellbeing.',
        logo: { url: 'https://ui-avatars.com/api/?name=EW&background=random' }
      }
    ]
  },
  {
    displayName: 'TEST_Lucy Williams',
    countryOfResidence: 'New Zealand',
    aboutWorkWithJoe: 'Test profile - Holistic health practitioner and meditation guide.',
    hopingToConnectWith: 'Health practitioners interested in mind-body connection.',
    eventsAttended: [
      { name: 'Week Long Advanced Retreat - Australia 2023' }
    ],
    businesses: [
      {
        name: 'TEST_Natural Harmony Healing',
        headline: 'Restore Your Natural Balance',
        category: 'Holistic Health',
        description: 'Natural healing approaches combined with meditation practices.',
        logo: { url: 'https://ui-avatars.com/api/?name=NH&background=random' },
        socialAddresses: {
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com'
        }
      },
      {
        name: 'TEST_Mind-Body Wellness Center',
        headline: 'Integrated Approach to Health',
        category: 'Wellness & Health',
        description: 'Comprehensive wellness programs and healing services.',
        logo: { url: 'https://ui-avatars.com/api/?name=MW&background=random' }
      }
    ]
  }
];

// Function to create all test profiles
export const createTestProfiles = async () => {
  try {
    const testProfilesCollection = collection(db, 'test_profiles');
    const createdProfiles = [];

    for (const profile of testProfiles) {
      const docRef = await addDoc(testProfilesCollection, {
        ...profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      createdProfiles.push(docRef.id);
      console.log('Created test profile:', docRef.id);
    }

    return createdProfiles;
  } catch (error) {
    console.error('Error creating test profiles:', error);
    throw error;
  }
};

// Function to delete all test profiles
export const deleteTestProfiles = async () => {
  try {
    const testProfilesCollection = collection(db, 'test_profiles');
    const snapshot = await getDocs(testProfilesCollection);
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log(`Deleted ${snapshot.docs.length} test profiles`);
    return snapshot.docs.length;
  } catch (error) {
    console.error('Error deleting test profiles:', error);
    throw error;
  }
}; 