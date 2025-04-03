import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Custom hook to manage likes for directory listings
 */
export const useLikes = () => {
  const { currentUser } = useAuth();
  const [userLikes, setUserLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the current user's likes when the hook is initialized
  useEffect(() => {
    const fetchUserLikes = async () => {
      if (!currentUser) {
        setUserLikes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userDocRef = doc(db, 'userLikes', currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUserLikes(docSnap.data().likedBusinesses || []);
        } else {
          // Create empty user likes document if it doesn't exist
          await setDoc(userDocRef, { likedBusinesses: [] });
          setUserLikes([]);
        }
      } catch (err) {
        console.error('Error fetching user likes:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLikes();
  }, [currentUser]);

  /**
   * Toggle like status for a business
   * @param {string} profileId - Owner's profile ID
   * @param {string} businessIndex - Index of the business in profile
   */
  const toggleLike = async (profileId, businessIndex) => {
    if (!currentUser) {
      console.error('User must be logged in to like a business');
      return { success: false, error: 'User must be logged in to like a business' };
    }

    const likeId = `${profileId}-${businessIndex}`;
    const isLiked = userLikes.includes(likeId);

    try {
      // Update user's likes list
      const userLikesRef = doc(db, 'userLikes', currentUser.uid);
      
      if (isLiked) {
        // Remove like
        await updateDoc(userLikesRef, {
          likedBusinesses: arrayRemove(likeId)
        });
        setUserLikes(prev => prev.filter(id => id !== likeId));
      } else {
        // Add like
        await updateDoc(userLikesRef, {
          likedBusinesses: arrayUnion(likeId)
        });
        setUserLikes(prev => [...prev, likeId]);
      }

      // Update business like count
      const profileRef = doc(db, 'profiles', profileId);
      const profileDoc = await getDoc(profileRef);
      
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        const businesses = profileData.businesses || [];
        
        // Ensure the business exists at the specified index
        if (businesses[businessIndex]) {
          // Initialize likes array if it doesn't exist
          if (!businesses[businessIndex].likes) {
            businesses[businessIndex].likes = [];
          }
          
          const likes = businesses[businessIndex].likes;
          
          if (isLiked) {
            // Remove user from likes
            const updatedLikes = likes.filter(uid => uid !== currentUser.uid);
            businesses[businessIndex].likes = updatedLikes;
          } else {
            // Add user to likes
            businesses[businessIndex].likes = [...likes, currentUser.uid];
          }
          
          // Update the business with new likes
          await updateDoc(profileRef, { businesses });
        }
      }
      
      return { success: true, isLiked: !isLiked };
    } catch (err) {
      console.error('Error toggling like:', err);
      setError(err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Check if a business is liked by the current user
   * @param {string} profileId - Owner's profile ID
   * @param {string} businessIndex - Index of the business in profile
   * @returns {boolean} Whether the business is liked
   */
  const isBusinessLiked = (profileId, businessIndex) => {
    if (!currentUser) return false;
    const likeId = `${profileId}-${businessIndex}`;
    return userLikes.includes(likeId);
  };

  /**
   * Get like count for a business
   * @param {Object} business - The business object
   * @returns {number} Number of likes
   */
  const getLikeCount = (business) => {
    return business.likes?.length || 0;
  };

  return {
    toggleLike,
    isBusinessLiked,
    getLikeCount,
    loading,
    error
  };
}; 