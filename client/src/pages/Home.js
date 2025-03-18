import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import FrostedCard from '../components/FrostedCard';
import GradientButton from '../components/GradientButton';
import { FaUsers, FaUserPlus, FaUserEdit } from 'react-icons/fa';

const Home = () => {
  const { currentUser } = useAuth();
  const { profile } = useProfile(currentUser?.uid);

  // Custom icon component for the Welcome card
  const WelcomeIcon = () => {
    if (profile?.profilePicture?.url) {
      return (
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img 
            src={profile.profilePicture.url} 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '';
            }}
          />
        </div>
      );
    }
    return <FaUserEdit className="h-8 w-8" />;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16 pt-10">
        <div className="flex justify-center mb-8">
          <img src="/assets/We Are Geniuses Logo.svg" alt="We Are Geniuses" className="h-32" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-6">
          Find just the genius you are looking for!
        </h1>
        <p className="text-xl text-white max-w-2xl mx-auto">
          This is a directory of dedicated Dr Joe Dispenza practitioners, connected heart-centered 
          individuals who are committed to personal transformation and spiritual growth through 
          meditation to manifesting their reality. </p>
          <p className="text-xl text-white max-w-3xl mx-auto">Let's connect and find the genius that is perfect for your path!
        </p>
      </div>

      {/* CTA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <FrostedCard
          title="Directory"
          icon={<FaUsers className="h-8 w-8" />}
          iconColor="bg-gradient-button-orange"
        >
          <p className="text-gray-700 mb-6">
            Connect with just the Genius you are looking for. Who knows where your journey will go!
          </p>
          <GradientButton to="/directory" arrow={true}>
            Browse Directory
          </GradientButton>
        </FrostedCard>

        {currentUser ? (
          <FrostedCard
            title={`Welcome ${profile?.displayName || 'Back'}!`}
            icon={<WelcomeIcon />}
            iconColor={profile?.profilePicture?.url ? '' : 'bg-gradient-button-pink'}
          >
            <p className="text-gray-700 mb-6">
              Welcome back! Keep your profile up to date to make meaningful connections.
            </p>
            <GradientButton to="/profile" variant="pink" arrow={true}>
              Edit Profile
            </GradientButton>
          </FrostedCard>
        ) : (
          <FrostedCard
            title="Register"
            icon={<FaUserPlus className="h-8 w-8" />}
            iconColor="bg-gradient-button-pink"
          >
            <p className="text-gray-700 mb-6">
              Join our directory, open yourself up to new possibilities and connections.
            </p>
            <GradientButton to="/register" variant="pink" arrow={true}>
              Create Profile
            </GradientButton>
          </FrostedCard>
        )}
      </div>
    </div>
  );
};

export default Home; 