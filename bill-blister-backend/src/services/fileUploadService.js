const supabase = require('../config/supabase');
const path = require('path');

class FileUploadService {
  constructor() {
    this.supabase = supabase;
    this.bucketName = 'bill-blister-files';
  }

  async initializeBucket() {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }

    try {
      // Check if bucket exists
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const bucketExists = buckets.some(bucket => bucket.name === this.bucketName);

      if (!bucketExists) {
        // Create bucket if it doesn't exist
        const { error } = await this.supabase.storage.createBucket(this.bucketName, {
          public: false, // Private bucket for security
        });

        if (error) {
          console.error('Error creating bucket:', error);
          throw error;
        }

        console.log(`✅ Created bucket: ${this.bucketName}`);
      }
    } catch (error) {
      console.error('Error initializing bucket:', error);
      throw error;
    }
  }

  async uploadFile(file, folder = 'uploads') {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = path.extname(file.originalname);
      const fileName = `${timestamp}_${randomString}${fileExtension}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
        });

      if (error) {
        console.error('Error uploading file:', error);
        throw error;
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        fileName: fileName,
        filePath: filePath,
        publicUrl: urlData.publicUrl,
        size: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  async deleteFile(filePath) {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }

    try {
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting file:', error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('File deletion error:', error);
      throw error;
    }
  }

  async getFileUrl(filePath) {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }

    try {
      const { data } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }

  async listFiles(folder = '') {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }

    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .list(folder);

      if (error) {
        console.error('Error listing files:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('File listing error:', error);
      throw error;
    }
  }
}

module.exports = new FileUploadService();
