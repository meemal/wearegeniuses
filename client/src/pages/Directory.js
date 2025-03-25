import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaBuilding, FaUser } from 'react-icons/fa';
import LoadingSkeleton from '../components/LoadingSkeleton';
import LoadingProgress from '../components/LoadingProgress';
import { useDebounce } from '../hooks/useDebounce';

const Directory = () => {
  // Fetch all profiles with directory listings
  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['directory'],
    queryFn: async () => {
      try {
        console.log('Fetching profiles...');
        const [profilesSnapshot, testProfilesSnapshot] = await Promise.all([
          getDocs(collection(db, 'profiles')),
          getDocs(collection(db, 'test_profiles'))
        ]);
        
        const profilesData = [];
        
        // Add regular profiles
        profilesSnapshot.forEach(doc => {
          const profile = doc.data();
          if (profile.businesses && profile.businesses.length > 0) {
            profilesData.push({
              id: doc.id,
              ...profile
            });
          }
        });

        // Add test profiles
        testProfilesSnapshot.forEach(doc => {
          const profile = doc.data();
          if (profile.businesses && profile.businesses.length > 0) {
            profilesData.push({
              id: doc.id,
              isTest: true,
              ...profile
            });
          }
        });

        console.log('Fetched profiles:', profilesData);
        return profilesData;
      } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
    }
  });

  if (isLoading) {
    return (
      <>
        <LoadingProgress stage="Loading directory..." />
        <LoadingSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Error Loading Directory</h2>
        <p className="text-gray-300">There was an error loading the directory. Please try again later.</p>
        <p className="text-red-300 mt-2">{error.message}</p>
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">No Listings Found</h2>
        <p className="text-gray-300">There are no directory listings available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Directory</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map(profile => (
          profile.businesses.map((business, index) => (
            <div 
              key={`${profile.id}-${index}`} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${profile.isTest ? 'border-2 border-amber-500' : ''}`}
            >
              {profile.isTest && (
                <div className="bg-amber-500 text-white text-xs px-2 py-1 text-center">
                  Test Profile
                </div>
              )}
              
              {/* Business Logo */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {business.logo?.url ? (
                  <img
                    src={business.logo.url}
                    alt={`${business.name} logo`}
                    className="max-h-full max-w-full object-contain p-4"
                  />
                ) : (
                  <span className="text-gray-400 text-4xl">🏢</span>
                )}
              </div>

              {/* Business Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{business.name}</h3>
                <p className="text-gray-600 mb-4">{business.headline}</p>
                
                {/* Description */}
                <p className="text-gray-700 mb-6 line-clamp-3">{business.description}</p>

                {/* Visit Profile Button */}
                <Link
                  to={`/view-profile/${profile.id}`}
                  className="block w-full text-center bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 transition-colors"
                >
                  Visit Profile
                </Link>
              </div>
            </div>
          ))
        ))}
      </div>

      {/* No Results Message */}
      {!isLoading && profiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No profiles found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Directory; 