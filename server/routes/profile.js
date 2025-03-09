const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const UserProfile = require('../models/UserProfile');

// Configure Google Cloud Storage
const storage = new Storage({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ user: req.params.userId });
    
    if (!profile) {
      profile = new UserProfile({ user: req.params.userId });
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { user: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    
    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Upload profile/cover image
router.post('/upload/:userId', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId } = req.params;
    const { type } = req.body; // 'profilePicture' or 'coverPhoto'
    
    // Generate unique filename
    const filename = `${userId}-${type}-${Date.now()}${path.extname(req.file.originalname)}`;
    
    // Upload to Google Cloud Storage
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on('error', (error) => {
      console.error('Error uploading to GCS:', error);
      res.status(500).json({ error: 'Error uploading file' });
    });

    blobStream.on('finish', async () => {
      // Make the file public
      await blob.makePublic();
      
      // Get the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      
      // Update user profile with new image URL
      const update = {
        [type]: {
          url: publicUrl,
          filename: filename
        }
      };
      
      await UserProfile.findOneAndUpdate(
        { user: userId },
        update,
        { new: true, upsert: true }
      );
      
      res.json({
        url: publicUrl,
        filename: filename
      });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error('Error in file upload:', error);
    res.status(500).json({ error: 'Error processing file upload' });
  }
});

module.exports = router; 