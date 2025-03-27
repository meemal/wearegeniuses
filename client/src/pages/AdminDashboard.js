import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { BUSINESS_CATEGORIES } from '../constants/profileOptions';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState('');

  // Redirect if not the admin user
  if (!currentUser || currentUser.email !== 'naomispirit@gmail.com') {
    return <Navigate to="/" replace />;
  }

  const createTestData = async () => {
    try {
      setIsCreating(true);
      setStatus('Creating test data...');

      // Generate 10 test users
      for (let i = 1; i <= 10; i++) {
        const userId = `test-user-${i}`;
        const numBusinesses = Math.floor(Math.random() * 4) + 1; // 1-4 businesses per user

        const businesses = [];
        for (let j = 1; j <= numBusinesses; j++) {
          const category = BUSINESS_CATEGORIES[Math.floor(Math.random() * BUSINESS_CATEGORIES.length)];
          businesses.push({
            name: `${category} Business ${j}`,
            headline: `Leading ${category.toLowerCase()} solutions provider`,
            category: category,
            description: `We are a dedicated ${category.toLowerCase()} business focused on delivering exceptional value to our clients. Our team of experts brings years of experience and innovation to every project.`,
            services: [
              `${category} Consulting`,
              `${category} Training`,
              `${category} Solutions`
            ],
            email: `contact@${category.toLowerCase()}business${j}.com`,
            phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
            socialAddresses: {
              website: `https://${category.toLowerCase()}business${j}.com`,
              facebook: `https://facebook.com/${category.toLowerCase()}business${j}`,
              linkedin: `https://linkedin.com/company/${category.toLowerCase()}business${j}`,
              youtube: `https://youtube.com/${category.toLowerCase()}business${j}`
            }
          });
        }

        const profile = {
          displayName: `Test User ${i}`,
          countryOfResidence: 'United States',
          aboutWorkWithJoe: `I've been practicing Dr. Joe's teachings for ${Math.floor(Math.random() * 5) + 1} years.`,
          hopingToConnectWith: 'Looking to connect with like-minded individuals in the community.',
          eventsAttended: [
            { name: 'Week Long Advanced Retreat', date: '2023-01-15' },
            { name: 'Progressive & Intensive Workshop', date: '2023-06-20' }
          ],
          businesses: businesses,
          social: {
            facebook: `https://facebook.com/testuser${i}`,
            website: `https://testuser${i}.com`,
            linkedin: `https://linkedin.com/in/testuser${i}`
          }
        };

        await addDoc(collection(db, 'profiles'), profile);
        setStatus(`Created test user ${i} of 10...`);
      }

      setStatus('Test data created successfully!');
    } catch (error) {
      console.error('Error creating test data:', error);
      setStatus('Error creating test data: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteTestData = async () => {
    try {
      setIsDeleting(true);
      setStatus('Deleting test data...');

      const profilesSnapshot = await getDocs(collection(db, 'profiles'));
      let deletedCount = 0;

      for (const doc of profilesSnapshot.docs) {
        const profile = doc.data();
        if (profile.displayName?.startsWith('Test User')) {
          await deleteDoc(doc.ref);
          deletedCount++;
        }
      }

      setStatus(`Successfully deleted ${deletedCount} test profiles`);
    } catch (error) {
      console.error('Error deleting test data:', error);
      setStatus('Error deleting test data: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>
      
      {/* Test Data Management */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Test Data Management</h2>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={createTestData}
              disabled={isCreating || isDeleting}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Test Data'}
            </button>
            <button
              onClick={deleteTestData}
              disabled={isCreating || isDeleting}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete Test Data'}
            </button>
          </div>
          {status && (
            <p className="text-gray-600">{status}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
            <div>
              <p className="text-gray-600">Active Listings</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
          <div className="space-y-4">
            <p className="text-gray-600">No recent activity to display</p>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">System Status</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Database Status</p>
              <p className="text-green-600">Online</p>
            </div>
            <div>
              <p className="text-gray-600">API Status</p>
              <p className="text-green-600">Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 