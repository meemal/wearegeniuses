import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import LoadingSkeleton from '../components/LoadingSkeleton';
import LoadingProgress from '../components/LoadingProgress';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaEdit, FaGlobe, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';

const ViewProfile = () => {
  const { currentUser } = useAuth();
  const { profile, isLoading } = useProfile(currentUser?.uid);

  if (isLoading) {
    return (
      <>
        <LoadingProgress stage="Loading profile..." />
        <LoadingSkeleton />
      </>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Profile Not Found</h2>
        <p className="text-gray-300">There was an error loading your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Profile</h2>
        <Link
          to="/profile"
          className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
        >
          <FaEdit className="mr-2" />
          Edit Profile
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="relative rounded-lg overflow-hidden mb-8">
        <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-48 bg-gray-200">
            {profile.coverPhoto?.url ? (
              <img
                src={profile.coverPhoto.url}
                alt="Cover"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: profile.coverPhoto.position || 'center'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500">No cover photo</span>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Profile Picture and Basic Info */}
            <div className="flex items-start -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                {profile.profilePicture?.url ? (
                  <img
                    src={profile.profilePicture.url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-bold text-gray-800">{profile.displayName}</h3>
                {profile.countryOfResidence && (
                  <p className="text-gray-600 flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    {profile.countryOfResidence}
                  </p>
                )}
              </div>
            </div>

            {/* About Work with Joe */}
            {profile.aboutWorkWithJoe && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">About Work with Joe</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{profile.aboutWorkWithJoe}</p>
              </div>
            )}

            {/* About your work with Joe Dispenza */}
            {profile.aboutWorkWithJoeDispenza && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">About your work with Joe Dispenza</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{profile.aboutWorkWithJoeDispenza}</p>
              </div>
            )}

            {/* Hoping to Connect With */}
            {profile.hopingToConnectWith && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Hoping to Connect With</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{profile.hopingToConnectWith}</p>
              </div>
            )}

            {/* Events Attended */}
            {profile.eventsAttended && profile.eventsAttended.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Events Attended</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.eventsAttended.map((event, index) => (
                    <span
                      key={index}
                      className="bg-pink-500 text-white rounded-full px-3 py-1 text-sm font-medium"
                    >
                      {event.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <FaEnvelope className="w-5 h-5 mr-3 text-gray-500" />
                  <span>{profile.email}</span>
                </div>
                {profile.location && (
                  <div className="flex items-center text-gray-700">
                    <FaMapMarkerAlt className="w-5 h-5 mr-3 text-gray-500" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {profile.social && Object.keys(profile.social).length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h4>
                <div className="flex space-x-4">
                  {profile.social.website && (
                    <a
                      href={profile.social.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-amber-500"
                    >
                      <FaGlobe className="w-5 h-5" />
                    </a>
                  )}
                  {profile.social.facebook && (
                    <a
                      href={profile.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#1877F2]"
                    >
                      <FaFacebook className="w-5 h-5" />
                    </a>
                  )}
                  {profile.social.linkedin && (
                    <a
                      href={profile.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#0A66C2]"
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                  )}
                  {profile.social.youtube && (
                    <a
                      href={profile.social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#FF0000]"
                    >
                      <FaYoutube className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Directory Listings */}
      {profile.businesses && profile.businesses.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Directory Listings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.businesses.map((business, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
                <div className="relative p-6">
                  {/* Business Logo */}
                  <div className="h-32 bg-gray-100 flex items-center justify-center mb-4 rounded-lg">
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
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{business.name}</h4>
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile; 