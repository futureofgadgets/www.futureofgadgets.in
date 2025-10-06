// Utility functions for Cloudinary image handling

export const uploadFilesToCloudinary = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload images');
  }

  const result = await response.json();
  return result.files;
};



export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  // Check file size (2MB limit for better performance)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be less than 2MB' };
  }

  // Check supported formats
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported image format. Use JPEG, PNG, GIF, or WebP' };
  }

  return { valid: true };
};