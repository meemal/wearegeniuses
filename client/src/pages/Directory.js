import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import LoadingSkeleton from '../components/LoadingSkeleton';
import LoadingProgress from '../components/LoadingProgress';
import { FaGlobe, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Directory = () => {
  // Fetch all profiles with directory listings
  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['directory'],
    queryFn: async () => {
      const profilesSnapshot = await getDocs(collection(db, 'profiles'));
      const profilesData = [];
      
      profilesSnapshot.forEach(doc => {
        const profile = doc.data();
        if (profile.businesses && profile.businesses.length > 0) {
          profilesData.push({
            id: doc.id,
            ...profile
          });
        }
      });
      
      return profilesData;
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
            <div key={`${profile.id}-${index}`} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                    {business.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6 line-clamp-3">{business.description}</p>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {business.socialAddresses?.website && (
                    <a
                      href={business.socialAddresses.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-amber-500"
                    >
                      <FaGlobe className="w-5 h-5" />
                    </a>
                  )}
                  {business.socialAddresses?.facebook && (
                    <a
                      href={business.socialAddresses.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#1877F2]"
                    >
                      <FaFacebook className="w-5 h-5" />
                    </a>
                  )}
                  {business.socialAddresses?.linkedin && (
                    <a
                      href={business.socialAddresses.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#0A66C2]"
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                  )}
                  {business.socialAddresses?.youtube && (
                    <a
                      href={business.socialAddresses.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#FF0000]"
                    >
                      <FaYoutube className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default Directory; 