import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Default profile structure for new users
 */
const DEFAULT_PROFILE = {
  profilePicture: { url: '' },
  coverPhoto: { url: '' },
  businesses: [],
  countryOfResidence: '',
  social: {
    facebook: '',
    website: '',
    linkedin: ''
  },
  displayName: '',
  eventsAttended: [],
  aboutWorkWithJoe: '',
  hopingToConnectWith: '',
};

/**
 * Custom hook for managing user profile data
 * @param {string} userId - The ID of the user whose profile to manage
 * @returns {Object} Profile data and management functions
 * @property {Object} profile - The user's profile data
 * @property {boolean} isLoading - Whether the profile is being fetched
 * @property {Object} error - Any error that occurred during fetching
 * @property {Function} updateProfile - Function to update the profile
 * @property {boolean} isUpdating - Whether the profile is being updated
 */
export const useProfile = (userId) => {
  const queryClient = useQueryClient();

  // Fetch profile
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }
      
      // If profile doesn't exist, create a new one with timestamps
      const newProfile = {
        ...DEFAULT_PROFILE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, newProfile);
      return newProfile;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    enabled: Boolean(userId), // Only run the query if we have a userId
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false // Don't refetch when window regains focus
  });

  // Update profile
  const { mutate: updateProfile, isLoading: isUpdating } = useMutation({
    mutationFn: async (updatedData) => {
      if (!userId) throw new Error('User ID is required to update profile');
      
      const docRef = doc(db, 'profiles', userId);
      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      // Here you could add toast notifications or other error handling
    }
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    isUpdating
  };
}; 