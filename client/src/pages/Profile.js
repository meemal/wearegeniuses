import React, { useState, useCallback, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useImageUpload } from '../hooks/useImageUpload';
import { FaCamera, FaPlus, FaTimes, FaFacebook, FaLinkedin, FaGlobe, FaYoutube } from 'react-icons/fa';

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

const Profile = () => {
  const { currentUser } = useAuth();
  const { profile, isLoading, updateProfile, isUpdating } = useProfile(currentUser?.uid);
  const { uploadImage, isUploading } = useImageUpload();
  const [uploadStatus, setUploadStatus] = useState('');
  
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

  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: profile || defaultValues
  });

  const { fields: businesses, append: appendBusiness, remove: removeBusiness } = useFieldArray({
    control,
    name: 'businesses'
  });

  const handleImageUpload = useCallback(async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadStatus('Uploading...');
      const result = await uploadImage(file, `profiles/${currentUser.uid}/${type}`);
      
      if (!result) {
        setUploadStatus('Upload failed: No result returned');
        return;
      }

      // Update form value
      setValue(type, result);

      // Update profile in database
      try {
        await updateProfile({ [type]: result });
        setUploadStatus('Upload successful!');
      } catch (error) {
        console.error('Error updating profile with new image:', error);
        setUploadStatus('Image uploaded but profile update failed. Please try saving again.');
      }

      // Clear status after delay
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
      setTimeout(() => setUploadStatus(''), 5000);
    }
  }, [currentUser?.uid, uploadImage, setValue, updateProfile]);

  const onSubmit = useCallback(async (data) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }, [updateProfile]);

  const handleAddBusiness = useCallback(() => {
    appendBusiness({
      name: '',
      website: '',
      socialAddresses: {
        facebook: '',
        youtube: '',
        instagram: '',
        linkedin: ''
      },
      headline: '',
      category: ''
    });
  }, [appendBusiness]);

  // Add loading spinner component
  const LoadingSpinner = () => (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
    </div>
  );

  // Update the image input sections to show loading state
  const renderImageUploadButton = (type, icon) => (
    <label className={`absolute ${type === 'coverPhoto' ? 'bottom-4 right-4' : '-bottom-2 right-0 transform translate-x-2'} 
      bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 ${isUploading ? 'opacity-50' : ''}`}>
      {icon}
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, type)}
        disabled={isUploading}
      />
      {isUploading && <LoadingSpinner />}
    </label>
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Your Profile</h2>

      {uploadStatus && (
        <div className={`mb-4 p-4 rounded ${
          uploadStatus.includes('failed') 
            ? 'bg-red-100 text-red-700 border-l-4 border-red-500'
            : uploadStatus.includes('successful')
              ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
              : 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
        }`}>
          {uploadStatus}
        </div>
      )}

      <div className="relative rounded-lg overflow-hidden mb-8">
        <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
        <form onSubmit={handleSubmit(onSubmit)} className="relative p-6">
          {/* Cover Photo */}
          <div className="relative h-48 mb-16 rounded-lg overflow-hidden bg-gray-200">
            {watch('coverPhoto.url') ? (
              <img
                src={watch('coverPhoto.url')}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">Add Cover Photo</span>
              </div>
            )}
            {renderImageUploadButton('coverPhoto', <FaCamera className="text-gray-600 w-5 h-5" />)}
          </div>

          {/* Profile Picture */}
          <div className="absolute left-6 top-32 w-32 h-32">
            <div className="relative w-full h-full">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                {watch('profilePicture.url') ? (
                  <img
                    src={watch('profilePicture.url')}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">Add Photo</span>
                  </div>
                )}
              </div>
              {renderImageUploadButton('profilePicture', <FaCamera className="text-gray-600 w-4 h-4" />)}
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

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Country of Residence
              </label>
              <input
                {...register('countryOfResidence')}
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Your country of residence"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaFacebook className="w-5 h-5 mr-2 text-[#1877F2]" />
                Facebook
              </label>
              <input
                {...register('social.facebook')}
                type="url"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Facebook URL"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaGlobe className="w-5 h-5 mr-2 text-gray-600" />
                Website
              </label>
              <input
                {...register('social.website')}
                type="url"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Website URL"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaLinkedin className="w-5 h-5 mr-2 text-[#0A66C2]" />
                LinkedIn
              </label>
              <input
                {...register('social.linkedin')}
                type="url"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="LinkedIn URL"
              />
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
            
            {businesses.map((field, index) => (
              <div key={field.id} className="mb-6 p-4 border rounded-lg bg-white">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-gray-700">Listing {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeBusiness(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>

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
                      Website
                    </label>
                    <input
                      {...register(`businesses.${index}.website`)}
                      type="url"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Website"
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
            ))}
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
                  className="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 flex items-center"
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
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => {
                if (e.target.value) {
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

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-amber-500 text-white px-6 py-2 rounded hover:bg-amber-600 transition-colors"
              disabled={isUpdating || isUploading}
            >
              {isUpdating ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 