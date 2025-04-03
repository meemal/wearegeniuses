import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useLikes } from '../hooks/useLikes';
import { FaHeart } from 'react-icons/fa';

/**
 * Component to display a user's liked business listings
 * @param {string} userId - The user ID whose likes to display
 */
const UserLikes = ({ userId }) => {
  const { isBusinessLiked, toggleLike } = useLikes();
  const [likedBusinesses, setLikedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedBusinesses = async () => {
      if (!userId) {
        setLikedBusinesses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get the user's likes
        const userLikesDoc = await getDoc(doc(db, 'userLikes', userId));
        
        if (!userLikesDoc.exists()) {
          setLikedBusinesses([]);
          setLoading(false);
          return;
        }
        
        const likedIds = userLikesDoc.data().likedBusinesses || [];
        const businessesData = [];
        
        // Fetch each liked business
        for (const likeId of likedIds) {
          // likeId format is profileId-businessIndex
          const [profileId, businessIndex] = likeId.split('-');
          
          // Get the profile
          const profileDoc = await getDoc(doc(db, 'profiles', profileId));
          
          if (profileDoc.exists()) {
            const profile = profileDoc.data();
            
            // Get the business at the specified index
            if (profile.businesses && profile.businesses[businessIndex]) {
              const business = profile.businesses[businessIndex];
              
              businessesData.push({
                id: likeId,
                profileId,
                businessIndex: parseInt(businessIndex),
                business,
                profileName: profile.displayName || 'Unknown User'
              });
            }
          }
        }
        
        setLikedBusinesses(businessesData);
      } catch (err) {
        console.error('Error fetching liked businesses:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLikedBusinesses();
  }, [userId]);
  
  const handleUnlike = async (profileId, businessIndex) => {
    try {
      await toggleLike(profileId, businessIndex);
      // Remove the unliked business from the state
      setLikedBusinesses(prev => 
        prev.filter(item => 
          !(item.profileId === profileId && item.businessIndex === businessIndex)
        )
      );
    } catch (err) {
      console.error('Error unliking business:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading liked businesses. Please try again later.
      </div>
    );
  }
  
  if (likedBusinesses.length === 0) {
    return (
      <div className="p-4 text-gray-700 text-center">
        <p>No liked businesses yet.</p>
        <Link to="/directory" className="text-amber-500 hover:text-amber-600 mt-2 inline-block">
          Browse the directory to find businesses you like.
        </Link>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {likedBusinesses.map(({ id, profileId, businessIndex, business, profileName }) => (
        <div key={id} className="bg-white rounded-lg shadow-sm p-4 flex items-center">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{business.name}</h3>
            <p className="text-gray-600 text-sm">
              {business.category && (
                <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full mr-2">
                  {business.category}
                </span>
              )}
              <span>By {profileName}</span>
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Link 
              to={`/profile/${profileId}`}
              className="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
            >
              View
            </Link>
            
            <button
              onClick={() => handleUnlike(profileId, businessIndex)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors flex items-center"
            >
              <FaHeart className="text-red-500 mr-1" /> Unlike
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserLikes; 