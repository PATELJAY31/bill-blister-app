const multer = require('multer');
const path = require('path');
const config = require('../config');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = config.upload.allowedTypes;
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 5, // Maximum 5 files per request
  },
});

// Generate unique filename
const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, extension);
  
  return `${nameWithoutExt}_${timestamp}_${randomString}${extension}`;
};

// Generate file path for Firebase Storage
const generateFilePath = (folder, fileName) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${folder}/${year}/${month}/${day}/${fileName}`;
};

// Validate file size
const validateFileSize = (file) => {
  if (file.size > config.upload.maxFileSize) {
    throw new Error(`File size too large. Maximum size: ${config.upload.maxFileSize / (1024 * 1024)}MB`);
  }
  return true;
};

// Validate file type
const validateFileType = (file) => {
  if (!config.upload.allowedTypes.includes(file.mimetype)) {
    throw new Error(`Invalid file type. Allowed types: ${config.upload.allowedTypes.join(', ')}`);
  }
  return true;
};

// Process uploaded files
const processUploadedFiles = (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  return files.map(file => {
    // Validate file
    validateFileSize(file);
    validateFileType(file);

    return {
      originalName: file.originalname,
      fileName: generateFileName(file.originalname),
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer,
    };
  });
};

// Single file upload middleware
const uploadSingle = (fieldName) => {
  return upload.single(fieldName);
};

// Multiple files upload middleware
const uploadMultiple = (fieldName, maxCount = 5) => {
  return upload.array(fieldName, maxCount);
};

// Fields upload middleware
const uploadFields = (fields) => {
  return upload.fields(fields);
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  generateFileName,
  generateFilePath,
  validateFileSize,
  validateFileType,
  processUploadedFiles,
};
