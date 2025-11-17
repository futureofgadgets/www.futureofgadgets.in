// Utility functions for Cloudinary image handling

export const uploadFilesToCloudinary = async (files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) {
    throw new Error('No files provided for upload');
  }

  // Validate all files before upload
  for (const file of files) {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(`${file.name}: ${validation.error}`);
    }
  }

  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || errorData.details || 'Failed to upload images');
  }

  const result = await response.json();
  
  if (!result.files || !Array.isArray(result.files)) {
    throw new Error('Invalid response from upload service');
  }

  return result.files;
};



export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be less than 5MB' };
  }

  // Check supported formats
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported image format. Use JPEG, PNG, GIF, or WebP' };
  }

  return { valid: true };
};