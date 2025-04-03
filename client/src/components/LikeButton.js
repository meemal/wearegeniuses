import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useLikes } from '../hooks/useLikes';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Like button component for directory listings
 * 
 * @param {Object} props
 * @param {string} props.profileId - ID of the profile owner
 * @param {number} props.businessIndex - Index of the business in the profile
 * @param {Object} props.business - Business data
 */
const LikeButton = ({ profileId, businessIndex, business }) => {
  const { currentUser } = useAuth();
  const { isBusinessLiked, toggleLike, getLikeCount } = useLikes();
  const [isLiked, setIsLiked] = useState(isBusinessLiked(profileId, businessIndex));
  const [likeCount, setLikeCount] = useState(getLikeCount(business));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLikeClick = async () => {
    // If user is not logged in, redirect to login page
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await toggleLike(profileId, businessIndex);
      if (result.success) {
        setIsLiked(result.isLiked);
        // Update like count based on the new state
        setLikeCount(prev => result.isLiked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button 
      onClick={handleLikeClick}
      disabled={isLoading}
      className="flex items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors"
      aria-label={isLiked ? "Unlike" : "Like"}
      title={currentUser ? (isLiked ? "Unlike" : "Like") : "Login to like"}
    >
      {isLiked ? (
        <FaHeart className="text-amber-500" />
      ) : (
        <FaRegHeart />
      )}
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton; 