import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import TestProfileManager from '../components/TestProfileManager';
import { FaUsers, FaCog, FaExclamationTriangle } from 'react-icons/fa';

const Admin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setError('Access denied. Admin privileges required.');
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Error checking permissions');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">{error}</div>
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome, {currentUser?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Profile Management Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FaUsers className="text-2xl text-gray-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Test Profile Management</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Create and manage test profiles for development and testing purposes.
            </p>
            <TestProfileManager />
          </div>

          {/* System Status Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FaCog className="text-2xl text-gray-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Status</span>
                <span className="text-sm text-green-600">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Authentication</span>
                <span className="text-sm text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="text-sm text-green-600">Available</span>
              </div>
            </div>
          </div>

          {/* Warning Section */}
          <div className="md:col-span-2 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-2xl text-amber-500 mr-3" />
              <h2 className="text-xl font-semibold text-amber-800">Important Notice</h2>
            </div>
            <p className="mt-2 text-sm text-amber-700">
              This is an administrative interface. Please use caution when performing operations that affect user data or system settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 