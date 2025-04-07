import { convertToWebP, downloadBlob } from './imageConverter.js';
import JSZip from 'jszip';

// DOM Elements
const filesUploadSection = document.getElementById('filesUploadSection');
const resultsSection = document.getElementById('resultsSection');
const fileList = document.getElementById('fileList');
const convertedImagesList = document.getElementById('convertedImagesList');
const convertBtn = document.getElementById('convertBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');

// State
let filesToConvert = [];
let convertedFiles = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // File Input Handler (fixed)
  document.getElementById('fileInput').addEventListener('change', (event) => {
    const newFiles = Array.from(event.target.files);
    filesToConvert = [...filesToConvert, ...newFiles];
    renderFileList();
    updateConvertButton();
    event.target.value = '';
  });

  // Drag and drop functionality (fixed)
  const dropZone = document.querySelector('label[for="fileInput"]');
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('bg-gray-100');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('bg-gray-100');
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('bg-gray-100');
    
    if (e.dataTransfer.files.length) {
      const newFiles = Array.from(e.dataTransfer.files);
      filesToConvert = [...filesToConvert, ...newFiles];
      renderFileList();
      updateConvertButton();
    }
  });

  // Quality slider
  qualitySlider.addEventListener('input', () => {
    qualityValue.textContent = `${qualitySlider.value}%`;
  });

  // Convert button
  convertBtn.addEventListener('click', convertFiles);

  // Download all button
  downloadAllBtn.addEventListener('click', downloadAllFiles);
});

// Convert Files to WebP (keep your original implementation)
async function convertFiles() {
  const quality = parseInt(qualitySlider.value) / 100;
  convertedFiles = [];

  // Show loading state
  convertBtn.disabled = true;
  convertBtn.textContent = 'Converting...';

  try {
    for (const file of filesToConvert) {
      const webpBlob = await convertToWebP(file, quality);
      const originalSize = file.size;
      const webpSize = webpBlob.size;

      convertedFiles.push({
        name: file.name.replace(/\.[^/.]+$/, '.webp'),
        blob: webpBlob,
        originalSize,
        webpSize,
        originalWidth: file.originalWidth,
        originalHeight: file.originalHeight
      });
    }

    renderConvertedFiles();
    toggleSections();
  } catch (error) {
    console.error('Conversion error:', error);
    alert('Error converting images: ' + error.message);
  } finally {
    convertBtn.disabled = false;
    convertBtn.textContent = 'Convert to WebP';
  }
}

// Download all files as zip (keep your original implementation)
async function downloadAllFiles() {
  if (convertedFiles.length === 0) return;

  try {
    const zip = new JSZip();
    convertedFiles.forEach(file => zip.file(file.name, file.blob));
    const zipBlob = await zip.generateAsync({type: 'blob'});
    downloadBlob(zipBlob, 'webp-images.zip');
  } catch (error) {
    console.error('Download error:', error);
    alert('Error creating zip file: ' + error.message);
  }
}

// Render File List with Thumbnails
function renderFileList() {
  fileList.innerHTML = '';
  filesToConvert.forEach((file, index) => {
    const fileItem = document.createElement('div');
    fileItem.className = 'flex justify-between items-center py-2 border-b border-gray-200';

    const thumbnailContainer = document.createElement('div');
    thumbnailContainer.className = 'flex items-center';

    const thumbnail = document.createElement('img');
    thumbnail.className = 'w-32 h-32 object-cover mr-2 rounded'; // Increased size
    thumbnail.alt = file.name;
    const objectUrl = URL.createObjectURL(file);
    thumbnail.src = objectUrl;
    thumbnail.onload = () => {
      // Store original dimensions for later use
      file.originalWidth = thumbnail.naturalWidth;
      file.originalHeight = thumbnail.naturalHeight;
      URL.revokeObjectURL(objectUrl);
    };

    const fileInfo = document.createElement('div');
    fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'text-red-500 hover:text-red-700';
    deleteBtn.innerHTML = 'X';
    deleteBtn.onclick = () => removeFile(index);

    thumbnailContainer.appendChild(thumbnail);
    thumbnailContainer.appendChild(fileInfo);
    fileItem.appendChild(thumbnailContainer);
    fileItem.appendChild(deleteBtn);

    fileList.appendChild(fileItem);
  });
}

function renderConvertedFiles() {
  convertedImagesList.innerHTML = '';
  convertedFiles.forEach((file, index) => {
    const resultItem = document.createElement('div');
    resultItem.className = 'bg-gray-50 p-4 rounded mb-3 flex flex-wrap items-start';

    // Create thumbnail preview
    const imgPreview = document.createElement('img');
    imgPreview.className = 'preserve-dimensions rounded mr-4';
    imgPreview.style.width = '50%'; // Set to 50% of original size
    imgPreview.style.height = 'auto';
    imgPreview.style.maxWidth = '100%';

    const objectUrl = URL.createObjectURL(file.blob);
    imgPreview.src = objectUrl;
    imgPreview.onload = () => URL.revokeObjectURL(objectUrl);

    // Create right side container for info and buttons
    const rightContainer = document.createElement('div');
    rightContainer.className = 'flex-1 flex flex-col justify-between';

    // File info
    const fileInfo = document.createElement('div');
    fileInfo.className = 'mb-3';
    fileInfo.innerHTML = `
      <div class="font-semibold mb-1">${file.name}</div>
      <div class="text-sm text-gray-600">
        Original: ${formatFileSize(file.originalSize)}<br>
        WebP: ${formatFileSize(file.webpSize)}<br>
        Saved: <span class="text-green-600 font-medium">${Math.round((1 - file.webpSize / file.originalSize) * 100)}%</span>
      </div>
    `;

    // Button group
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'flex items-center mt-2';

    // Download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 flex items-center';
    downloadBtn.innerHTML = '<span>Download</span>';
    downloadBtn.onclick = () => downloadBlob(file.blob, file.name);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'ml-2 bg-gray-200 text-red-600 py-1 px-2 rounded hover:bg-gray-300 flex items-center font-bold';
    deleteBtn.innerHTML = 'X';
    deleteBtn.onclick = () => removeConvertedFile(index);

    // Add buttons to group
    buttonGroup.appendChild(downloadBtn);
    buttonGroup.appendChild(deleteBtn);

    // Add elements to right container
    rightContainer.appendChild(fileInfo);
    rightContainer.appendChild(buttonGroup);

    // Add main elements to result item
    resultItem.appendChild(imgPreview);
    resultItem.appendChild(rightContainer);

    convertedImagesList.appendChild(resultItem);
  });
}


// Remove File from Upload List
function removeFile(index) {
  filesToConvert.splice(index, 1);
  renderFileList();
  updateConvertButton();
}

// Remove Converted File from Results List
function removeConvertedFile(index) {
  convertedFiles.splice(index, 1);
  renderConvertedFiles();
  if (convertedFiles.length === 0) toggleSections();
}

// Toggle Sections Visibility
function toggleSections() {
  if (convertedFiles.length > 0) {
    filesUploadSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
  } else {
    filesUploadSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
  }
}

// Update convert button state
function updateConvertButton() {
  convertBtn.disabled = filesToConvert.length === 0;
}

// Format File Size Helper
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
