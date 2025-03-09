import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FrostedCard from '../components/FrostedCard';
import GradientButton from '../components/GradientButton';

const Home = () => {
  const { currentUser } = useAuth();

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
          <p className="text-xl text-white max-w-3xl mx-auto">Let's connect and find the genius that id perfect for your path!
        </p>
      </div>

      {/* CTA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <FrostedCard
          title="Directory"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          iconColor="bg-gradient-button-orange"
        >
          <p className="text-gray-700 mb-6">
            Connect with just the Genius you are looking for. Who knows where your journey will go!
          </p>
          <GradientButton to="/directory" arrow={true}>
            Browse Directory
          </GradientButton>
        </FrostedCard>

        <FrostedCard
          title="Register"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
          iconColor="bg-gradient-button-pink"
        >
          <p className="text-gray-700 mb-6">
            Join our directory, open yourself up to new possibilities and connections.
          </p>
          <GradientButton to="/register" variant="pink" arrow={true}>
            Create Profile
          </GradientButton>
        </FrostedCard>
      </div>
    </div>
  );
};

export default Home; 