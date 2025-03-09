const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  socialAddresses: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  headline: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  }
});

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profilePicture: {
    url: String,
    filename: String
  },
  coverPhoto: {
    url: String,
    filename: String
  },
  businesses: [businessSchema],
  countryOfResidence: {
    type: String,
    trim: true
  },
  social: {
    facebook: String,
    website: String,
    linkedin: String
  },
  headline: {
    type: String,
    trim: true
  },
  sector: {
    type: String,
    trim: true
  },
  customSector: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  eventsAttended: [{
    name: {
      type: String,
      trim: true
    },
    date: Date
  }],
  aboutWorkWithJoe: {
    type: String,
    trim: true
  },
  hopingToConnectWith: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Pre-defined lists for dropdowns
userProfileSchema.statics.defaultSectors = [
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

userProfileSchema.statics.defaultSkills = [
  'Angel Investment',
  'Startup',
  'Web Developer',
  'App Developer',
  'Designer',
  'Energetic Healer',
  'EFT',
  'Architect',
  'Accountant',
  'Life Coach',
  'Yoga Teacher',
  'Events Planning',
  'Writing',
  'Accountability Buddy'
];

userProfileSchema.statics.defaultEvents = [
  'Barcelona Progressive 2024',
  'Basel Progressive 2024',
  'Cancun June 2024 - Oversoul',
  'London 2022 - Garden of Life',
  'Cancun December 2024 - One Mind-One Heart'
];

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile; 