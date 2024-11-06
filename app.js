require('dotenv').config(); // Load environment variables from .env file
const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

// FTP server credentials from environment variables
const FTP_CONFIG = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  port: 21,
};

// Video file extensions you want to process
const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv'];

// Function to list video files
async function listVideoFiles() {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Optional: Enable verbose logging

  try {
    await client.access({
      host: FTP_CONFIG.host,
      user: FTP_CONFIG.user,
      password: FTP_CONFIG.password,
      port: FTP_CONFIG.port,
    });

    console.log('Connected to the FTP server.');
    // List the files and directories in the root directory
    const fileList = await client.list('/');

    console.log('Video files on the server:');
    const videoFiles = fileList.filter(file => {
      const ext = path.extname(file.name).toLowerCase();
      return videoExtensions.includes(ext);
    });

    videoFiles.forEach(file => {
      console.log(file.name);
    });

    return videoFiles; // Return the filtered list of video files
  } catch (err) {
    console.error('Error listing files:', err);
  } finally {
    client.close();
  }
}

// Function to download a video file
async function downloadVideoFile(remoteFilePath, localFilePath) {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: FTP_CONFIG.host,
      user: FTP_CONFIG.user,
      password: FTP_CONFIG.password,
      port: FTP_CONFIG.port,
    });

    console.log(`Downloading video file: ${remoteFilePath}`);
    await client.downloadTo(localFilePath, remoteFilePath);
    console.log(`File downloaded to: ${localFilePath}`);
  } catch (err) {
    console.error('Error downloading file:', err);
  } finally {
    client.close();
  }
}

// Example usage:
async function main() {
  const videoFiles = await listVideoFiles();

  // If you want to download a video file, for example the first video in the list:
  if (videoFiles.length > 0) {
    const remoteFile = videoFiles[0].name; // Select the first video file in the list
    const localPath = path.join(__dirname, remoteFile); // Local path to save the file
    await downloadVideoFile(remoteFile, localPath);
  }
}

main();
