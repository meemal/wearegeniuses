import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import LoadingSkeleton from '../components/LoadingSkeleton';
import LoadingProgress from '../components/LoadingProgress';
import UserLikes from '../components/UserLikes';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaEdit, FaGlobe, FaFacebook, FaLinkedin, FaYoutube, FaPhone, FaHeart } from 'react-icons/fa';

const ViewProfile = () => {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const { profile, isLoading } = useProfile(userId || currentUser?.uid);
  const isOwnProfile = !userId || userId === currentUser?.uid;

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
        <p className="text-gray-300">There was an error loading the profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Profile</h2>
        {isOwnProfile && (
          <Link
            to="/profile"
            className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </Link>
        )}
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

            {/* Social Links */}
            {(profile.social?.website || profile.social?.facebook || profile.social?.linkedin) && (
              <div className="mt-6 flex flex-wrap gap-4">
                {profile.social?.website && (
                  <a href={profile.social.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-500 transition-colors">
                    <FaGlobe className="inline mr-2" />
                    Website
                  </a>
                )}
                {profile.social?.facebook && (
                  <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-500 transition-colors">
                    <FaFacebook className="inline mr-2" />
                    Facebook
                  </a>
                )}
                {profile.social?.linkedin && (
                  <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-500 transition-colors">
                    <FaLinkedin className="inline mr-2" />
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Businesses Section */}
      {profile.businesses && profile.businesses.length > 0 && (
        <div className="relative rounded-lg overflow-hidden mb-8">
          <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
          <div className="relative p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Businesses & Services</h3>
            <div className="space-y-8">
              {profile.businesses.map((business, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{business.name}</h4>
                  
                  {business.category && (
                    <div className="mb-2">
                      <span className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                        {business.category}
                      </span>
                    </div>
                  )}
                  
                  {business.headline && (
                    <p className="text-gray-700 mb-2 italic">{business.headline}</p>
                  )}
                  
                  {business.description && (
                    <p className="text-gray-700 mb-4">{business.description}</p>
                  )}
                  
                  {/* Contact Info */}
                  <div className="space-y-2 mt-4">
                    {business.location && (
                      <p className="text-gray-600 flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        {business.location}
                      </p>
                    )}
                    {business.email && (
                      <p className="text-gray-600 flex items-center">
                        <FaEnvelope className="mr-2" />
                        <a href={`mailto:${business.email}`} className="hover:text-amber-500 transition-colors">
                          {business.email}
                        </a>
                      </p>
                    )}
                    {business.phone && (
                      <p className="text-gray-600 flex items-center">
                        <FaPhone className="mr-2" />
                        <a href={`tel:${business.phone}`} className="hover:text-amber-500 transition-colors">
                          {business.phone}
                        </a>
                      </p>
                    )}
                  </div>
                  
                  {/* Skills */}
                  {business.skills && business.skills.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Skills</h5>
                      <div className="flex flex-wrap gap-2">
                        {business.skills.map((skill, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Services */}
                  {business.services && business.services.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Services</h5>
                      <div className="space-y-2">
                        {business.services.map((service, idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded">
                            <h6 className="font-medium text-gray-800">{service.name}</h6>
                            {service.description && (
                              <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Social Links */}
                  {business.socialAddresses && Object.values(business.socialAddresses).some(val => val) && (
                    <div className="mt-4 flex flex-wrap gap-4">
                      {business.socialAddresses.facebook && (
                        <a href={business.socialAddresses.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-500 transition-colors">
                          <FaFacebook className="inline mr-2" />
                          Facebook
                        </a>
                      )}
                      {business.socialAddresses.youtube && (
                        <a href={business.socialAddresses.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-500 transition-colors">
                          <FaYoutube className="inline mr-2" />
                          YouTube
                        </a>
                      )}
                      {business.socialAddresses.linkedin && (
                        <a href={business.socialAddresses.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-500 transition-colors">
                          <FaLinkedin className="inline mr-2" />
                          LinkedIn
                        </a>
                      )}
                      {business.website && (
                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-amber-500 transition-colors">
                          <FaGlobe className="inline mr-2" />
                          Website
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Events Attended Section */}
      {profile.eventsAttended && profile.eventsAttended.length > 0 && (
        <div className="relative rounded-lg overflow-hidden mb-8">
          <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
          <div className="relative p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Events Attended</h3>
            <div className="flex flex-wrap gap-2">
              {profile.eventsAttended.map((event, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {event}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Liked Businesses Section - Only show on own profile */}
      {isOwnProfile && (
        <div className="relative rounded-lg overflow-hidden mb-8">
          <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
          <div className="relative p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaHeart className="text-amber-500 mr-2" />
              Liked Businesses
            </h3>
            <UserLikes userId={currentUser?.uid} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile; 