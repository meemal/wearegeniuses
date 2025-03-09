import React from 'react';
import { BUSINESS_CATEGORIES } from '../constants/profileOptions';

const BusinessForm = ({ 
  business, 
  onUpdate, 
  onRemove,
  isNew = false
}) => {
  const handleChange = (field, value) => {
    onUpdate({
      ...business,
      [field]: value
    });
  };

  const handleSocialChange = (platform, value) => {
    onUpdate({
      ...business,
      socialAddresses: {
        ...business.socialAddresses,
        [platform]: value
      }
    });
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {isNew ? 'Add New Business' : 'Business Information'}
        </h3>
        {!isNew && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Name *
          </label>
          <input
            type="text"
            value={business.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            value={business.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
            placeholder="https://"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Category *
          </label>
          <select
            value={business.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
            required
          >
            <option value="">Select a category</option>
            {BUSINESS_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Headline
          </label>
          <input
            type="text"
            value={business.headline || ''}
            onChange={(e) => handleChange('headline', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
            placeholder="Brief description of your business"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Social Media
          </label>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Facebook</label>
            <input
              type="url"
              value={business.socialAddresses?.facebook || ''}
              onChange={(e) => handleSocialChange('facebook', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">LinkedIn</label>
            <input
              type="url"
              value={business.socialAddresses?.linkedin || ''}
              onChange={(e) => handleSocialChange('linkedin', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="https://linkedin.com/..."
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Twitter</label>
            <input
              type="url"
              value={business.socialAddresses?.twitter || ''}
              onChange={(e) => handleSocialChange('twitter', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="https://twitter.com/..."
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Instagram</label>
            <input
              type="url"
              value={business.socialAddresses?.instagram || ''}
              onChange={(e) => handleSocialChange('instagram', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessForm; 