import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatAuthError } from '../utils/errorMessages';

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', formatAuthError(error));
    }
  };

  return (
    <>
      {/* Promo banner */}
      <div className="bg-brand-purple text-white px-4 py-2 text-center relative">
        <div className="flex items-center justify-center">
          <span className="mr-2">🎉</span> 
          <span>Limited Time Offer: Free for the first 100 users!</span>
          <Link to="/register" className="ml-2 text-white font-medium hover:underline">
            Read more →
          </Link>
        </div>
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white">
          ×
        </button>
      </div>
      
      {/* Main navigation */}
      <nav className="bg-transparent py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/assets/we-are-geniuses-favicon.svg" alt="We Are Geniuses" className="h-10 w-auto" />
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link to="/directory" className="text-white hover:text-gray-200 font-medium">
                Directory
              </Link>
              <Link to="/about" className="text-white hover:text-gray-200 font-medium">
                About
              </Link>
              
              {currentUser ? (
                <div className="relative group">
                  <button className="text-white hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-1">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-white hover:text-gray-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation; 