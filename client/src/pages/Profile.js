import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useImageUpload } from '../hooks/useImageUpload';
import { FaCamera, FaPlus, FaTimes, FaFacebook, FaLinkedin, FaGlobe, FaYoutube, FaArrowDown, FaArrowUp, FaCheck } from 'react-icons/fa';
import ImageCropper from '../components/ImageCropper';
import LoadingSkeleton from '../components/LoadingSkeleton';
import LoadingProgress from '../components/LoadingProgress';

// Move these outside component to prevent recreating on each render
const defaultEvents = [
  'Barcelona Progressive 2024',
  'Basel Progressive 2024',
  'Cancun June 2024 - Oversoul',
  'London 2022 - Garden of Life',
  'Cancun December 2024 - One Mind-One Heart'
];

const availableSectors = [
  'Community',
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Arts',
  'Wellness',
  'Business',
  'Other'
];

const socialIcons = {
  facebook: [FaFacebook, '#1877F2'],
  youtube: [FaYoutube, '#FF0000'],
  instagram: [FaFacebook, '#E4405F'],
  linkedin: [FaLinkedin, '#0A66C2']
};

// Add country list constant
const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "New Zealand",
  "Ireland", "Germany", "France", "Spain", "Italy", "Netherlands", "Belgium",
  "Switzerland", "Austria", "Sweden", "Norway", "Denmark", "Finland", "Iceland",
  "Portugal", "Greece", "Japan", "South Korea", "Singapore", "Hong Kong",
  "Other"
].sort();

const Profile = () => {
  const { currentUser } = useAuth();
  const { profile, isLoading, error, updateProfile, isUpdating } = useProfile(currentUser?.uid);
  const { uploadImage, isUploading, uploadingType } = useImageUpload();
  const [uploadStatus, setUploadStatus] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [showNewEventInput, setShowNewEventInput] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Authenticating...');
  const [progressiveLoad, setProgressiveLoad] = useState({
    basicInfo: false,
    images: false,
    events: false,
    businesses: false,
    complete: false
  });
  
  const defaultValues = useMemo(() => ({
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
    hopingToConnectWith: ''
  }), []);

  // Form initialization with proper merging of default values and profile
  const formInitialValues = useMemo(() => {
    if (!profile) return defaultValues;
    return {
      ...defaultValues,
      ...profile,
      // Ensure nested objects are properly merged
      social: { ...defaultValues.social, ...profile.social }
    };
  }, [profile, defaultValues]);

  const { register, control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: formInitialValues
  });

  const { fields: businesses, append: appendBusiness, remove: removeBusiness } = useFieldArray({
    control,
    name: 'businesses'
  });

  // Add debug logging
  console.log('[Profile] Debug:', {
    hasCurrentUser: !!currentUser,
    currentUserId: currentUser?.uid,
    isLoading,
    hasProfile: !!profile,
    error: error?.message,
    profileData: profile
  });

  // Reset form when profile data changes
  React.useEffect(() => {
    if (profile) {
      console.log('[Profile] Resetting form with profile data:', profile);
      reset(profile);
    }
  }, [profile, reset]);

  // Add a default business listing if none exists
  React.useEffect(() => {
    if (profile && profile.businesses && profile.businesses.length === 0) {
      console.log('[Profile] No businesses found, adding a default listing');
      appendBusiness({
        name: '',
        website: '',
        logo: { url: '' },
        socialAddresses: {
          facebook: '',
          youtube: '',
          instagram: '',
          linkedin: ''
        },
        headline: '',
        category: '',
        description: ''
      });
    } else if (!profile && businesses.length === 0) {
      // If no profile or businesses array is empty, add a default listing
      console.log('[Profile] Adding default business listing');
      appendBusiness({
        name: '',
        website: '',
        logo: { url: '' },
        socialAddresses: {
          facebook: '',
          youtube: '',
          instagram: '',
          linkedin: ''
        },
        headline: '',
        category: '',
        description: ''
      });
    }
  }, [profile, businesses.length, appendBusiness]);

  // Update loading stages based on data availability
  React.useEffect(() => {
    if (!currentUser) {
      setLoadingStage('Authenticating...');
      return;
    }

    if (isLoading) {
      setLoadingStage('Loading profile data...');
      return;
    }

    if (profile) {
      console.log('[Profile] Profile data loaded:', profile);
      // Ensure form is reset with profile data
      Object.entries(profile).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key, value);
        }
      });
      
      // Simulate progressive loading
      const loadSequence = async () => {
        setLoadingStage('Loading images...');
        await new Promise(resolve => setTimeout(resolve, 300));
        setProgressiveLoad(prev => ({ ...prev, basicInfo: true }));

        setLoadingStage('Loading events...');
        await new Promise(resolve => setTimeout(resolve, 300));
        setProgressiveLoad(prev => ({ ...prev, images: true }));

        setLoadingStage('Preparing form...');
        await new Promise(resolve => setTimeout(resolve, 300));
        setProgressiveLoad(prev => ({ ...prev, events: true, businesses: true, complete: true }));
      };

      loadSequence();
    }
  }, [currentUser, isLoading, profile, setValue, reset]);

  const handleImageUpload = useCallback(async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'coverPhoto') {
      setCropImage(URL.createObjectURL(file));
      setShowCropper(true);
      return;
    }

    try {
      setUploadStatus('Uploading...');
      const result = await uploadImage(file, `profiles/${currentUser.uid}/${type}`);
      
      if (!result) {
        setUploadStatus('Upload failed: No result returned');
        return;
      }

      setValue(type, result);

      try {
        await updateProfile({ [type]: result });
        setUploadStatus('Upload successful!');
      } catch (error) {
        console.error('Error updating profile with new image:', error);
        setUploadStatus('Image uploaded but profile update failed. Please try saving again.');
      }

      setTimeout(() => setUploadStatus(''), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
      setTimeout(() => setUploadStatus(''), 5000);
    }
  }, [currentUser?.uid, uploadImage, setValue, updateProfile]);

  const handleCropComplete = useCallback(async (croppedAreaPixels) => {
    if (!cropImage) return;

    try {
      const canvas = document.createElement('canvas');
      const image = await createImage(cropImage);
      
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      
      const ctx = canvas.getContext('2d');
      
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'cropped-cover.jpg', { type: 'image/jpeg' });
        
        try {
          setUploadStatus('Uploading...');
          const result = await uploadImage(file, `profiles/${currentUser.uid}/coverPhoto`);
          
          if (!result) {
            setUploadStatus('Upload failed: No result returned');
            return;
          }

          setValue('coverPhoto', result);

          try {
            await updateProfile({ coverPhoto: result });
            setUploadStatus('Upload successful!');
          } catch (error) {
            console.error('Error updating profile with new image:', error);
            setUploadStatus('Image uploaded but profile update failed. Please try saving again.');
          }

          setTimeout(() => setUploadStatus(''), 3000);
        } catch (error) {
          console.error('Error uploading image:', error);
          setUploadStatus(`Upload failed: ${error.message}`);
          setTimeout(() => setUploadStatus(''), 5000);
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error processing image:', error);
    }
    
    setShowCropper(false);
    setCropImage(null);
  }, [cropImage, currentUser?.uid, uploadImage, setValue, updateProfile]);

  const handleAddCustomEvent = useCallback(async () => {
    if (!newEventName.trim()) return;

    try {
      // Add to events array
      const events = watch('eventsAttended') || [];
      setValue('eventsAttended', [
        ...events,
        { name: newEventName, date: new Date().toISOString() }
      ]);

      // Save to database (you'll need to implement this API endpoint)
      await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newEventName }),
      });

      // Reset input
      setNewEventName('');
      setShowNewEventInput(false);
    } catch (error) {
      console.error('Error adding custom event:', error);
    }
  }, [newEventName, watch, setValue]);

  const onSubmit = useCallback(async (data) => {
    try {
      setSaveStatus('Saving profile...');
      await updateProfile(data);
      setSaveStatus('Profile saved successfully!');
      setShowSaveSuccess(true);
      // Clear success message and icon after 3 seconds
      setTimeout(() => {
        setSaveStatus('');
        setShowSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus(`Failed to save profile: ${error.message}`);
      setShowSaveSuccess(false);
      setTimeout(() => setSaveStatus(''), 5000);
    }
  }, [updateProfile]);

  const handleAddBusiness = useCallback(() => {
    appendBusiness({
      name: '',
      website: '',
      logo: { url: '' },
      socialAddresses: {
        facebook: '',
        youtube: '',
        instagram: '',
        linkedin: ''
      },
      headline: '',
      category: '',
      description: ''
    });
  }, [appendBusiness]);

  // Handle business logo upload
  const handleBusinessLogoUpload = useCallback(async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      setUploadStatus('File size must be less than 5MB');
      setTimeout(() => setUploadStatus(''), 3000);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setUploadStatus('Please upload an image file');
      setTimeout(() => setUploadStatus(''), 3000);
      return;
    }

    try {
      setUploadStatus('Uploading logo...');
      console.log('[BusinessLogo] Starting upload for business index:', index);
      
      // Create a unique path for the business logo
      const businessId = watch(`businesses.${index}.id`) || `business-${index}`;
      const timestamp = Date.now();
      const path = `profiles/${currentUser.uid}/business-logos/${businessId}-${timestamp}`;
      
      console.log('[BusinessLogo] Uploading with path:', path);
      const result = await uploadImage(file, path);
      
      if (!result) {
        console.error('[BusinessLogo] Upload failed - no result returned');
        throw new Error('Upload failed: No result returned');
      }

      console.log('[BusinessLogo] Upload successful:', result);

      // Update the form state with the new logo data
      const logoData = {
        url: result.url,
        path: result.path,
        updatedAt: timestamp
      };

      console.log('[BusinessLogo] Updating form state with:', logoData);
      setValue(`businesses.${index}.logo`, logoData);

      // Get current businesses array and update the specific business
      const currentBusinesses = watch('businesses');
      const updatedBusinesses = [...currentBusinesses];
      updatedBusinesses[index] = {
        ...updatedBusinesses[index],
        logo: logoData
      };
      
      // Update profile with all businesses
      console.log('[BusinessLogo] Updating profile with new businesses data');
      await updateProfile({ businesses: updatedBusinesses });
      setUploadStatus('Logo uploaded successfully!');
      
    } catch (error) {
      console.error('[BusinessLogo] Error:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
    } finally {
      // Clear status message after 3 seconds
      setTimeout(() => setUploadStatus(''), 3000);
    }
  }, [currentUser?.uid, uploadImage, setValue, updateProfile, watch]);

  // Add URL formatting helper
  const formatUrl = (url) => {
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  // Add loading spinner component
  const LoadingSpinner = () => (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
    </div>
  );

  // Update the image input sections to show loading state
  const renderImageUploadButton = (type, label, customOnChange) => {
    const isUploading = uploadingType === type;
    const isProfilePicture = type === 'profilePicture';
    
    return (
      <label className={`absolute inset-0 ${isProfilePicture ? 'z-20' : 'z-10'} group cursor-pointer ${isProfilePicture ? 'rounded-full' : ''}`}>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={customOnChange || ((e) => handleImageUpload(e, type))}
          disabled={isUploading}
        />
        <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all ${isProfilePicture ? 'rounded-full' : ''}`}>
          {isUploading ? (
            <div className="flex flex-col items-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-white">
              <FaCamera className="text-2xl mb-1" />
              <span className="text-sm">{label}</span>
            </div>
          )}
        </div>
      </label>
    );
  };

  // Update the business listing section to properly display logos
  const renderBusinessListing = (field, index) => {
    console.log('[BusinessListing] Rendering business', index, 'with logo:', watch(`businesses.${index}.logo`));
    
    return (
      <div key={field.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
        {/* Business Logo Upload */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Business Logo
            </label>
            <div className="relative h-32 w-32 bg-gray-100 rounded-lg overflow-hidden">
              {watch(`businesses.${index}.logo.url`) ? (
                <div className="relative w-full h-full">
                  <img
                    src={watch(`businesses.${index}.logo.url`)}
                    alt={`${watch(`businesses.${index}.name`) || 'Business'} logo`}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      console.error('[BusinessLogo] Image failed to load:', e);
                      e.target.src = ''; // Clear the src to show the fallback
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Add Logo</span>
                </div>
              )}
              {renderImageUploadButton(
                `business-${index}-logo`,
                'Change Logo',
                (e) => handleBusinessLogoUpload(e, index)
              )}
            </div>
            {uploadStatus && uploadingType === `business-${index}-logo` && (
              <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>
            )}
          </div>
          
          {/* Rest of the business form fields */}
          <div className="col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  {...register(`businesses.${index}.name`)}
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Name"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Headline
                </label>
                <input
                  {...register(`businesses.${index}.headline`)}
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Headline"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Website
                </label>
                <input
                  {...register(`businesses.${index}.website`)}
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="example.com"
                  onBlur={(e) => {
                    const formattedUrl = formatUrl(e.target.value);
                    setValue(`businesses.${index}.website`, formattedUrl);
                  }}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Sector
                </label>
                <select
                  {...register(`businesses.${index}.category`)}
                  className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                >
                  <option value="">Select a sector</option>
                  {availableSectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                {...register(`businesses.${index}.description`)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                placeholder="Describe your business..."
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Social Media
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(socialIcons).map(([platform, [Icon, color]]) => (
                  <div key={platform}>
                    <label className="block text-gray-700 text-sm mb-1 capitalize flex items-center">
                      <Icon className="w-4 h-4 mr-2" style={{ color }} />
                      {platform}
                    </label>
                    <input
                      {...register(`businesses.${index}.socialAddresses.${platform}`)}
                      type="url"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={`${platform} URL`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <LoadingProgress stage="Authenticating..." />
        <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
        <p className="text-gray-600">You need to be signed in to view and edit your profile.</p>
      </div>
    );
  }

  if (isLoading || !progressiveLoad.complete) {
    return (
      <>
        <LoadingProgress stage={loadingStage} />
        <LoadingSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Profile</h2>
        <p className="text-gray-600">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Your Profile</h2>

      {(uploadStatus || saveStatus) && (
        <div className={`mb-4 p-4 rounded ${
          (uploadStatus.includes('failed') || saveStatus.includes('Failed')) 
            ? 'bg-red-100 text-red-700 border-l-4 border-red-500'
            : (uploadStatus.includes('successful') || saveStatus.includes('successfully'))
              ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
              : 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
        }`}>
          {uploadStatus || saveStatus}
        </div>
      )}

      <div className="relative rounded-lg overflow-hidden mb-8">
        <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
        <form onSubmit={handleSubmit(onSubmit)} className="relative p-6">
          {/* Cover Photo */}
          <div className="relative h-48 mb-16 rounded-lg overflow-hidden bg-gray-200">
            <div className="relative w-full h-full">
              {watch('coverPhoto.url') ? (
                <div className="relative w-full h-full">
                  <img
                    src={watch('coverPhoto.url')}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: watch('coverPhoto.position') || 'center'
                    }}
                  />
                  {uploadingType === 'coverPhoto' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  {uploadingType === 'coverPhoto' ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
                  ) : (
                    <span className="text-gray-500">Add Cover Photo</span>
                  )}
                </div>
              )}
              {!isUploading && renderImageUploadButton('coverPhoto', 'Change Cover')}
            </div>
          </div>

          {/* Profile Picture */}
          <div className="absolute left-6 top-32 w-32 h-32 z-30">
            <div className="relative w-full h-full">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                {watch('profilePicture.url') ? (
                  <div className="relative w-full h-full">
                    <img
                      src={watch('profilePicture.url')}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    {uploadingType === 'profilePicture' && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    {uploadingType === 'profilePicture' ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-600"></div>
                    ) : (
                      <span className="text-gray-500">Add Photo</span>
                    )}
                  </div>
                )}
                {!isUploading && renderImageUploadButton('profilePicture', 'Change Photo')}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Display Name
              </label>
              <input
                {...register('displayName')}
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Your display name"
              />
            </div>

            {/* Country of Residence */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Country of Residence
              </label>
              <select
                {...register('countryOfResidence')}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select a country...</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Directory Listings */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-gray-700 text-sm font-bold">
                Directory Listings
              </label>
              <button
                type="button"
                onClick={handleAddBusiness}
                className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors flex items-center"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add Listing
              </button>
            </div>
            
            {businesses.map((field, index) => renderBusinessListing(field, index))}
          </div>

          {/* Events Attended */}
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Events Attended
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {watch('eventsAttended', []).map((event, index) => (
                <span
                  key={index}
                  className="bg-pink-500 text-white rounded-full px-3 py-1 text-sm font-medium flex items-center"
                >
                  {event.name}
                  <button
                    type="button"
                    onClick={() => {
                      const events = watch('eventsAttended');
                      setValue(
                        'eventsAttended',
                        events.filter((_, i) => i !== index)
                      );
                    }}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            
            {showNewEventInput ? (
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter event name..."
                />
                <button
                  type="button"
                  onClick={handleAddCustomEvent}
                  className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewEventInput(false);
                    setNewEventName('');
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            ) : null}
            
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => {
                if (e.target.value === 'add-new') {
                  setShowNewEventInput(true);
                } else if (e.target.value) {
                  const events = watch('eventsAttended') || [];
                  if (!events.some(event => event.name === e.target.value)) {
                    setValue('eventsAttended', [
                      ...events,
                      { name: e.target.value, date: new Date().toISOString() }
                    ]);
                  }
                  e.target.value = '';
                }
              }}
            >
              <option value="">Select an event...</option>
              {defaultEvents
                .filter(event => !watch('eventsAttended', [])
                  .some(e => e.name === event))
                .map((event, index) => (
                  <option key={index} value={event}>{event}</option>
                ))}
              <option value="add-new">+ Add another event</option>
            </select>
          </div>

          {/* About Work with Joe */}
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              About your work with Joe Dispenza
            </label>
            <textarea
              {...register('aboutWorkWithJoe')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              placeholder="Describe your work and experience with Joe Dispenza..."
            />
          </div>

          {/* Hoping to Connect With */}
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Hoping to Connect With
            </label>
            <textarea
              {...register('hopingToConnectWith')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              placeholder="Describe who you're hoping to connect with..."
            />
          </div>

          {/* Update Submit Button section */}
          <div className="flex justify-end items-center space-x-4">
            {showSaveSuccess && (
              <span className="text-green-600 flex items-center">
                <FaCheck className="w-4 h-4 mr-1" />
                Saved
              </span>
            )}
            <button
              type="submit"
              className={`px-6 py-2 rounded transition-colors flex items-center ${
                isUpdating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-amber-500 hover:bg-amber-600'
              } text-white`}
              disabled={isUpdating || isUploading}
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>

      {showCropper && (
        <ImageCropper
          image={cropImage}
          onComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setCropImage(null);
          }}
        />
      )}
    </div>
  );
};

// Helper function to create an image for cropping
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

export default Profile; 