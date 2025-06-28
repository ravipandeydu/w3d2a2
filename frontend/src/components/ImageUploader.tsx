'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { FiUpload, FiLink, FiX } from 'react-icons/fi';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onImageUrlChange: (url: string) => void;
  imagePreview: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  onImageUrlChange, 
  imagePreview 
}) => {
  const [useUrl, setUseUrl] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onImageUrlChange(imageUrl.trim());
    }
  };

  const handleClearImage = () => {
    setImageUrl('');
    onImageUrlChange('');
  };

  return (
    <div className="mb-6">
      <div className="flex mb-4 space-x-4">
        <button
          type="button"
          className={`flex-1 py-2 px-4 rounded-md ${!useUrl ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setUseUrl(false)}
        >
          <FiUpload className="inline mr-2" />
          Upload Image
        </button>
        <button
          type="button"
          className={`flex-1 py-2 px-4 rounded-md ${useUrl ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setUseUrl(true)}
        >
          <FiLink className="inline mr-2" />
          Image URL
        </button>
      </div>

      {!useUrl ? (
        <div className="mb-6">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}`}
          >
            <input {...getInputProps()} />
            {imagePreview && !useUrl ? (
              <div className="relative">
                <div className="relative w-full h-64">
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    fill 
                    style={{ objectFit: 'contain' }} 
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearImage();
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <div>
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop an image here, or click to select a file
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <form onSubmit={handleUrlSubmit}>
            <div className="flex">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="input-field flex-grow rounded-r-none"
                required
              />
              <button
                type="submit"
                className="btn-primary rounded-l-none"
              >
                Load
              </button>
            </div>
          </form>
          
          {imagePreview && useUrl && (
            <div className="mt-4 relative">
              <div className="relative w-full h-64">
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  fill 
                  style={{ objectFit: 'contain' }} 
                />
              </div>
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;