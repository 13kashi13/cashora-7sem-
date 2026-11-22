const { google } = require('googleapis');
const axios = require('axios');
const path = require('path');

/**
 * Google Drive Service
 * Uploads videos to Google Drive and returns shareable links
 */

class GoogleDriveService {
  constructor() {
    this.drive = null;
    this.initialized = false;
  }

  /**
   * Initialize Google Drive with service account or OAuth credentials
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Check if we have service account credentials
      if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        const auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/drive.file']
        });
        this.drive = google.drive({ version: 'v3', auth });
        this.initialized = true;
        console.log('✅ Google Drive initialized with service account');
      } 
      // Use OAuth tokens if available (from YouTube auth)
      else if (process.env.GOOGLE_DRIVE_ACCESS_TOKEN) {
        const oauth2Client = new google.auth.OAuth2(
          process.env.YOUTUBE_CLIENT_ID,
          process.env.YOUTUBE_CLIENT_SECRET,
          process.env.YOUTUBE_REDIRECT_URI
        );
        
        oauth2Client.setCredentials({
          access_token: process.env.GOOGLE_DRIVE_ACCESS_TOKEN,
          refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
        });

        this.drive = google.drive({ version: 'v3', auth: oauth2Client });
        this.initialized = true;
        console.log('✅ Google Drive initialized with OAuth');
      }
      else {
        console.warn('⚠️  Google Drive credentials not configured. Set GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_DRIVE_ACCESS_TOKEN');
        this.initialized = false;
      }
    } catch (error) {
      console.error('❌ Failed to initialize Google Drive:', error.message);
      this.initialized = false;
    }
  }

  /**
   * Upload a video from URL to Google Drive
   * @param {string} videoUrl - Public URL of the video
   * @param {string} fileName - Name for the file in Drive
   * @param {string} folderId - Optional folder ID to store in
   * @returns {Promise<{success: boolean, fileId?: string, webViewLink?: string, webContentLink?: string}>}
   */
  async uploadVideoFromUrl(videoUrl, fileName, folderId = null) {
    await this.initialize();
    
    if (!this.initialized) {
      return {
        success: false,
        error: 'Google Drive not configured',
        message: 'Add GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_DRIVE_ACCESS_TOKEN to .env'
      };
    }

    try {
      console.log(`📤 Uploading video to Google Drive: ${fileName}`);
      
      // Download the video
      const response = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream'
      });

      // Upload to Drive
      const fileMetadata = {
        name: fileName,
        mimeType: 'video/mp4'
      };

      if (folderId) {
        fileMetadata.parents = [folderId];
      }

      const media = {
        mimeType: 'video/mp4',
        body: response.data
      };

      const file = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink, webContentLink'
      });

      // Make the file publicly accessible
      await this.drive.permissions.create({
        fileId: file.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });

      console.log(`✅ Video uploaded to Drive: ${file.data.id}`);

      return {
        success: true,
        fileId: file.data.id,
        webViewLink: file.data.webViewLink,
        webContentLink: file.data.webContentLink,
        // Direct video URL for embedding
        directUrl: `https://drive.google.com/uc?export=download&id=${file.data.id}`
      };
    } catch (error) {
      console.error('❌ Failed to upload to Google Drive:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a folder in Google Drive
   * @param {string} folderName 
   * @returns {Promise<{success: boolean, folderId?: string}>}
   */
  async createFolder(folderName) {
    await this.initialize();
    
    if (!this.initialized) {
      return { success: false, error: 'Google Drive not configured' };
    }

    try {
      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      };

      const folder = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id'
      });

      return {
        success: true,
        folderId: folder.data.id
      };
    } catch (error) {
      console.error('❌ Failed to create folder:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if Drive is configured and working
   */
  async testConnection() {
    await this.initialize();
    
    if (!this.initialized) {
      return { success: false, message: 'Not configured' };
    }

    try {
      const response = await this.drive.files.list({
        pageSize: 1,
        fields: 'files(id, name)'
      });
      
      return {
        success: true,
        message: 'Connected to Google Drive',
        canUpload: true
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

// Export singleton instance
module.exports = new GoogleDriveService();
