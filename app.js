// app.js
require('dotenv').config(); // Load environment variables from .env file
const { FTPClient } = require('basic-ftp');
const fs = require('fs');
const path = require('path');

// FTP server credentials from environment variables
const FTP_CONFIG = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  port: 21,
};

// Function to list files and directories
async function listFiles() {
  const client = new FTPClient();
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
    console.log('Files and folders on the server:');
    fileList.forEach(file => {
      console.log(file.name);
    });

    return fileList; // Return file/folder list for further operations (e.g., downloading)
  } catch (err) {
    console.error('Error listing files:', err);
  } finally {
    client.close();
  }
}

// Function to download a file
async function downloadFile(remoteFilePath, localFilePath) {
  const client = new FTPClient();
  try {
    await client.access({
      host: FTP_CONFIG.host,
      user: FTP_CONFIG.user,
      password: FTP_CONFIG.password,
      port: FTP_CONFIG.port,
    });

    console.log(`Downloading file: ${remoteFilePath}`);
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
  const fileList = await listFiles();

  // If you want to download a file, for example the first file in the list:
  if (fileList.length > 0) {
    const remoteFile = fileList[0].name; // Select the first file in the list
    const localPath = path.join(__dirname, remoteFile); // Local path to save the file
    await downloadFile(remoteFile, localPath);
  }
}

main();
