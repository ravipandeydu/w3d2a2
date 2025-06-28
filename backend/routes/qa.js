const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { processImageQuestion } = require('../services/qaService');

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Route for handling image upload and question
router.post('/image-upload', upload.single('image'), async (req, res) => {
  try {
    const { question } = req.body;
    const imageFile = req.file;
    
    if (!imageFile && !req.body.imageUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide either an image file or an image URL' 
      });
    }
    
    if (!question) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a question about the image' 
      });
    }
    
    // Process the image and question
    const result = await processImageQuestion({
      imageFile: imageFile ? imageFile.path : null,
      imageUrl: req.body.imageUrl || null,
      question
    });
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error processing image question:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing your request'
    });
  }
});

// Route for handling image URL and question
router.post('/image-url', async (req, res) => {
  try {
    const { imageUrl, question } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an image URL' 
      });
    }
    
    if (!question) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a question about the image' 
      });
    }
    
    // Process the image URL and question
    const result = await processImageQuestion({
      imageFile: null,
      imageUrl,
      question
    });
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error processing image URL question:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing your request'
    });
  }
});

module.exports = router;