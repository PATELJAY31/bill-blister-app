const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
      });

      console.log('✅ Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    // Don't exit the process, just log the error
    console.log('⚠️  File uploads will be disabled without Firebase configuration');
  }
};

// Get Firebase Storage bucket
const getStorageBucket = () => {
  try {
    return admin.storage().bucket();
  } catch (error) {
    console.error('❌ Firebase Storage not available:', error.message);
    return null;
  }
};

// Upload file to Firebase Storage
const uploadFile = async (file, folder = 'uploads') => {
  try {
    const bucket = getStorageBucket();
    if (!bucket) {
      throw new Error('Firebase Storage not available');
    }

    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('Upload error:', error);
        reject(error);
      });

      stream.on('finish', async () => {
        try {
          // Make the file public
          await fileUpload.makePublic();
          
          // Get the public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          resolve(publicUrl);
        } catch (error) {
          console.error('Error making file public:', error);
          reject(error);
        }
      });

      stream.end(file.buffer);
    });
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

// Delete file from Firebase Storage
const deleteFile = async (fileUrl) => {
  try {
    const bucket = getStorageBucket();
    if (!bucket) {
      throw new Error('Firebase Storage not available');
    }

    // Extract file name from URL
    const fileName = fileUrl.split('/').pop();
    const filePath = fileUrl.split(`${bucket.name}/`)[1];
    
    if (filePath) {
      await bucket.file(filePath).delete();
      console.log(`✅ File deleted: ${filePath}`);
    }
  } catch (error) {
    console.error('File deletion error:', error);
    throw error;
  }
};

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
});

module.exports = {
  initializeFirebase,
  uploadFile,
  deleteFile,
  upload,
  admin
};