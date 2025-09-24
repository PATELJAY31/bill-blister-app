const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      });

      console.log('✅ Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

// Get Firebase Storage bucket
const getStorageBucket = () => {
  try {
    return admin.storage().bucket();
  } catch (error) {
    console.error('❌ Error getting Firebase Storage bucket:', error);
    throw error;
  }
};

// Upload file to Firebase Storage
const uploadFile = async (file, path) => {
  try {
    const bucket = getStorageBucket();
    const fileUpload = bucket.file(path);
    
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('❌ Error uploading file:', error);
        reject(error);
      });

      stream.on('finish', async () => {
        try {
          // Make the file publicly accessible
          await fileUpload.makePublic();
          
          // Get the public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;
          resolve(publicUrl);
        } catch (error) {
          console.error('❌ Error making file public:', error);
          reject(error);
        }
      });

      stream.end(file.buffer);
    });
  } catch (error) {
    console.error('❌ Error in uploadFile:', error);
    throw error;
  }
};

// Delete file from Firebase Storage
const deleteFile = async (fileUrl) => {
  try {
    const bucket = getStorageBucket();
    const fileName = fileUrl.split('/').pop();
    const file = bucket.file(fileName);
    
    await file.delete();
    console.log(`✅ File deleted: ${fileName}`);
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    throw error;
  }
};

module.exports = {
  initializeFirebase,
  getStorageBucket,
  uploadFile,
  deleteFile,
};
