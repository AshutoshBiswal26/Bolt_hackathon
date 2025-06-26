
import React, { useState, useRef, useCallback } from 'react';
import { ImageUploaderProps } from '../types';
import Spinner from './Spinner';

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isLoading, onIdentify, selectedImageName }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File is too large. Please select an image under 5MB.");
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("Invalid file type. Please select an image (JPEG, PNG, GIF, WEBP).");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      onImageSelect(file, previewUrl);
    }
  }, [onImageSelect]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
       if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File is too large. Please select an image under 5MB.");
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("Invalid file type. Please select an image (JPEG, PNG, GIF, WEBP).");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      onImageSelect(file, previewUrl);
    }
  }, [onImageSelect]);

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`p-6 border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out
                  ${dragActive ? 'border-green-600 bg-green-100' : 'border-gray-300 hover:border-green-500'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 ${dragActive ? 'text-green-700' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className={`text-center ${dragActive ? 'text-green-700' : 'text-gray-500'}`}>
          Drag & drop your image here, or{' '}
          <button type="button" onClick={onButtonClick} className="font-medium text-green-600 hover:text-green-500 focus:outline-none focus:underline transition duration-150 ease-in-out" disabled={isLoading}>
            click to browse
          </button>
        </p>
        <p className="text-xs text-gray-400">PNG, JPG, GIF, WEBP up to 5MB</p>
        
        {selectedImageName && !isLoading && (
          <p className="text-sm text-gray-700 mt-2">Selected: {selectedImageName}</p>
        )}

        {selectedImageName && (
            <button
            onClick={onIdentify}
            disabled={isLoading}
            className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
            {isLoading ? (
                <>
                <Spinner size="sm" />
                <span className="ml-2">Identifying...</span>
                </>
            ) : (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Identify Species
                </>
            )}
            </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
