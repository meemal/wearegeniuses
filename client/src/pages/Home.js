import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to We Are Geniuses</h1>
        <p className="text-xl text-gray-600">
          A community platform for Joe Dispenza students to connect based on skills and experiences
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 mb-10">
        <h2 className="text-2xl font-bold mb-4">Connect with Like-Minded Individuals</h2>
        <p className="text-gray-700 mb-6">
          We Are Geniuses is a platform designed exclusively for Joe Dispenza students. Connect with others who share 
          your interests, skills, and experiences. Build meaningful relationships and continue your personal growth journey together.
        </p>

        {!currentUser ? (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg text-center"
            >
              Join the Community
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-primary-600 border border-primary-600 font-bold py-3 px-6 rounded-lg text-center"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <Link
              to="/profile"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              View Your Profile
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">Connect</h3>
          <p className="text-gray-700">
            Find and connect with other practitioners who share your interests and experiences.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">Share</h3>
          <p className="text-gray-700">
            Share your skills, knowledge, and journey with a supportive community.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">Grow</h3>
          <p className="text-gray-700">
            Continue your personal growth with resources and connections that elevate your practice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 