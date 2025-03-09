import { db, storage } from '../firebase';
import { 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc 
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL
} from 'firebase/storage';

// Get user profile
export const getProfile = async (userId) => {
    try {
        const profileDoc = await getDoc(doc(db, 'profiles', userId));
        if (profileDoc.exists()) {
            return profileDoc.data();
        } else {
            // Create default profile if it doesn't exist
            const defaultProfile = {
                displayName: '',
                bio: '',
                skills: [],
                directoryListings: [],
                socialLinks: {
                    linkedin: '',
                    youtube: '',
                    website: ''
                },
                profilePicture: '',
                coverPhoto: ''
            };
            await setDoc(doc(db, 'profiles', userId), defaultProfile);
            return defaultProfile;
        }
    } catch (error) {
        console.error('Error getting profile:', error);
        throw error;
    }
};

// Update profile data
export const updateProfile = async (userId, profileData) => {
    try {
        await updateDoc(doc(db, 'profiles', userId), profileData);
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

// Upload profile image (profile picture or cover photo)
export const uploadProfileImage = async (userId, file, type) => {
    try {
        const imageRef = ref(storage, `profiles/${userId}/${type}`);
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);
        
        // Update profile with new image URL
        const updateData = type === 'profile-picture' 
            ? { profilePicture: url }
            : { coverPhoto: url };
            
        await updateProfile(userId, updateData);
        return url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}; 