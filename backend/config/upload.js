import multer from "multer";
import { MAX_FILE_SIZE } from "../constants.js";

// Configure memory storage
const storage = multer.memoryStorage();

// File filter configuration
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = {
    'audio': [
      'audio/mpeg', // mp3
      'audio/wav',
      'audio/x-wav',
      'audio/aac',
      'audio/ogg'
    ],
    'image': [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif'
    ]
  };

  try {
    const [type] = file.mimetype.split('/');
    
    if (file.fieldname === 'song' && allowedMimeTypes.audio.includes(file.mimetype)) {
      cb(null, true);
    } 
    else if (file.fieldname === 'thumbnail' && allowedMimeTypes.image.includes(file.mimetype)) {
      cb(null, true);
    }
    else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname), false);
    }
  } catch (error) {
    cb(error, false);
  }
};

// Multer instance configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE || 50 * 1024 * 1024, // Default 50MB
    files: 2 // Maximum 2 files (song + thumbnail)
  }
});

// Custom error handler middleware
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let message = 'File upload error';
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = `File too large. Maximum size is ${MAX_FILE_SIZE/1024/1024}MB`;
    }
    else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files uploaded';
    }
    else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Invalid file type for ${err.field}`;
    }
    
    return res.status(413).json({ success: false, message });
  }
  
  if (err) {
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during file upload'
    });
  }
  
  next();
};

export { upload, handleUploadErrors };