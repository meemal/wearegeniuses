import React, { useState, useMemo, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import LoadingSkeleton from '../components/LoadingSkeleton';
import LoadingProgress from '../components/LoadingProgress';
import { FaGlobe, FaFacebook, FaLinkedin, FaYoutube, FaSearch, FaSync } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LikeButton from '../components/LikeButton';
import { useAuth } from '../context/AuthContext';

const Directory = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [displayCount, setDisplayCount] = useState(15);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setDisplayCount(15); // Reset to first page when searching
  };

  const fetchProfiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const profilesSnapshot = await getDocs(collection(db, 'profiles'));
      const profilesData = [];
      
      console.log('Raw Firebase Data:', profilesSnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })));
      
      profilesSnapshot.forEach(doc => {
        const profile = doc.data();
        if (profile.businesses && profile.businesses.length > 0) {
          const validBusinesses = profile.businesses.filter(business => business.name);
          if (validBusinesses.length > 0) {
          profilesData.push({
            id: doc.id,
              ...profile,
              businesses: validBusinesses
            });
          }
        }
      });
      
      console.log('Processed Profiles Data:', profilesData);
      setProfiles(profilesData);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Get unique categories from all businesses
  const categories = useMemo(() => {
    if (!profiles) return [];
    const uniqueCategories = new Set();
    profiles.forEach(profile => {
      profile.businesses.forEach(business => {
        if (business.category) {
          uniqueCategories.add(business.category);
        }
      });
    });
    return Array.from(uniqueCategories).sort();
  }, [profiles]);

  // Filter profiles based on search term and category
  const filteredProfiles = useMemo(() => {
    if (!profiles) return [];
    
    const searchTermLower = searchTerm.toLowerCase().trim();
    const searchWords = searchTermLower.split(/\s+/).filter(word => word.length > 0);
    
    console.log('Starting Search:', {
      searchTerm,
      searchTermLower,
      searchWords,
      totalProfiles: profiles.length
    });
    
    return profiles.map(profile => {
      return {
        ...profile,
        businesses: profile.businesses.filter(business => {
          const searchableFields = [];
          
          // Add basic fields
          if (business.name) searchableFields.push(business.name);
          if (business.description) searchableFields.push(business.description);
          if (business.headline) searchableFields.push(business.headline);
          if (business.category) searchableFields.push(business.category);
          
          // Add skills - handle both array and string formats
          if (business.skills) {
            console.log('Found skills for business:', business.name, business.skills);
            if (Array.isArray(business.skills)) {
              business.skills.forEach(skill => {
                if (skill) searchableFields.push(skill);
              });
            } else if (typeof business.skills === 'string') {
              searchableFields.push(business.skills);
            }
          }
          
          // Add services
          if (business.services) {
            business.services.forEach(service => {
              if (service.name) searchableFields.push(service.name);
              if (service.description) searchableFields.push(service.description);
            });
          }
          
          // Add contact info
          if (business.location) searchableFields.push(business.location);
          if (business.website) searchableFields.push(business.website);
          if (business.phone) searchableFields.push(business.phone);
          if (business.email) searchableFields.push(business.email);
          
          // Add social addresses
          if (business.socialAddresses) {
            Object.values(business.socialAddresses).forEach(value => {
              if (value) searchableFields.push(value);
            });
          }
          
          // Add any other string fields
          Object.entries(business).forEach(([key, value]) => {
            if (typeof value === 'string' && !searchableFields.includes(value)) {
              searchableFields.push(value);
            }
          });

          console.log(`Searching in business "${business.name}":`, {
            searchableFields,
            searchTerm: searchTermLower,
            searchWords,
            business
          });

          // More lenient search: match if any word matches
          const matchesSearch = searchTermLower === '' || 
            searchWords.some(word => 
              searchableFields.some(field => 
                field.toLowerCase().includes(word)
              )
            );
          
          const matchesCategory = selectedCategory === 'all' || business.category === selectedCategory;
          
          const matchedFields = searchableFields.filter(field => 
            searchWords.some(word => field.toLowerCase().includes(word))
          );
          
          console.log(`Business "${business.name}" matches:`, {
            search: matchesSearch,
            category: matchesCategory,
            searchTerm: searchTermLower,
            searchWords,
            matchedFields
          });
          
          return matchesSearch && matchesCategory;
        })
      };
    }).filter(profile => profile.businesses.length > 0);
  }, [profiles, searchTerm, selectedCategory]);

  // Get displayed profiles based on current display count
  const displayedProfiles = useMemo(() => {
    return filteredProfiles.slice(0, displayCount);
  }, [filteredProfiles, displayCount]);

  // Check if there are more profiles to load
  const hasMoreProfiles = displayedProfiles.length < filteredProfiles.length;

  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + 15);
  };

  // Debug logs
  useEffect(() => {
    console.log('Search State:', {
      searchTerm,
      selectedCategory,
      totalProfiles: profiles?.length,
      filteredProfiles: filteredProfiles.length,
      categories
    });
  }, [searchTerm, selectedCategory, profiles, filteredProfiles, categories]);

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
      
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setDisplayCount(15); // Reset to first page when changing category
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setDisplayCount(15); // Reset to first page when changing category
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-white">
        {filteredProfiles.length === 0 ? (
          <p>No results found</p>
        ) : (
          <p>Showing {displayedProfiles.length} of {filteredProfiles.length} results</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProfiles.map(profile => (
          profile.businesses.map((business, index) => (
            <div key={`${profile.id}-${index}`} className="bg-white rounded-lg shadow-lg overflow-hidden relative">
              {/* Like Button - Positioned at top right */}
              <div className="absolute top-2 right-2 z-10">
                <LikeButton 
                  profileId={profile.id}
                  businessIndex={index}
                  business={business}
                />
              </div>
              
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
                {business.headline && (
                <p className="text-gray-600 mb-4">{business.headline}</p>
                )}
                
                {business.category && (
                <div className="mb-4">
                  <span className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                    {business.category}
                  </span>
                </div>
                )}

                {business.description && (
                <p className="text-gray-700 mb-6 line-clamp-3">{business.description}</p>
                )}

                {/* Action Button - Visit Profile */}
                <div className="flex flex-col space-y-2">
                  <Link
                    to={`/profile/${profile.id}`}
                    className="block w-full text-center bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 transition-colors"
                  >
                    Visit Profile
                  </Link>
                </div>
              </div>
            </div>
          ))
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreProfiles && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Directory; 