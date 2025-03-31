/**
 * Converts an image to WebP format
 * @param {File|Blob} imageFile - The image file to convert
 * @param {Number} quality - Quality of WebP output (0-1)
 * @returns {Promise} - Promise resolving to WebP blob
 */
export function convertToWebP(imageFile, quality = 0.8) {
  return new Promise((resolve, reject) => {
    // Create image element
    const img = new Image();

    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw image on canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Convert to WebP using toBlob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image to WebP'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));

    // Load image from file
    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Creates a download link for a blob
 * @param {Blob} blob - The blob to download
 * @param {String} filename - Name for the downloaded file
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}
