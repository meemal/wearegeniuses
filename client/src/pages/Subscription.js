import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserPlus, FaCheck } from 'react-icons/fa';
import FrostedCard from '../components/FrostedCard';

const Subscription = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Upgrade to Access Directory</h2>
      
      <div className="relative rounded-lg overflow-hidden mb-8">
        <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
        <div className="relative p-6">
          <p className="text-gray-700 mb-4">
            The directory is available exclusively to subscribers. Join our community to connect with other practitioners and expand your network.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FrostedCard
          title="Free"
          icon={<FaUserPlus className="h-8 w-8" />}
          iconColor="bg-gradient-button-pink"
        >
          <ul className="space-y-3 mb-6">
            <li className="flex items-center text-gray-700">
              <FaCheck className="w-5 h-5 text-green-500 mr-2" />
              Basic profile
            </li>
            <li className="flex items-center text-gray-700">
              <FaCheck className="w-5 h-5 text-green-500 mr-2" />
              Access to community
            </li>
          </ul>
          <Link
            to="/register"
            className="inline-block w-full text-center bg-gray-200 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-300 transition-colors"
          >
            Get Started
          </Link>
        </FrostedCard>

        <FrostedCard
          title="Premium"
          icon={<FaUsers className="h-8 w-8" />}
          iconColor="bg-gradient-button-orange"
        >
          <ul className="space-y-3 mb-6">
            <li className="flex items-center text-gray-700">
              <FaCheck className="w-5 h-5 text-green-500 mr-2" />
              Full directory access
            </li>
            <li className="flex items-center text-gray-700">
              <FaCheck className="w-5 h-5 text-green-500 mr-2" />
              Business listings
            </li>
            <li className="flex items-center text-gray-700">
              <FaCheck className="w-5 h-5 text-green-500 mr-2" />
              Advanced networking
            </li>
          </ul>
          <Link
            to="/directory"
            className="inline-block w-full text-center bg-amber-500 text-white px-6 py-3 rounded-full hover:bg-amber-600 transition-colors"
          >
            Subscribe Now
          </Link>
        </FrostedCard>
      </div>
    </div>
  );
};

export default Subscription; 