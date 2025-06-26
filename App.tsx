
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultCard from './components/ResultCard';
import Alert from './components/Alert';
import Spinner from './components/Spinner';
import { identifySpeciesAndGetInfo } from './services/geminiService';
import { SpeciesData } from './types';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [identificationResult, setIdentificationResult] = useState<SpeciesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File, url: string) => {
    setSelectedFile(file);
    setPreviewUrl(url);
    setIdentificationResult(null); // Clear previous results
    setError(null); // Clear previous errors
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleIdentify = useCallback(async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIdentificationResult(null);

    try {
      const base64ImageData = await fileToBase64(selectedFile);
      const result = await identifySpeciesAndGetInfo(base64ImageData, selectedFile.type);
      setIdentificationResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during identification.");
      }
      console.error("Identification error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 py-8 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-green-700 tracking-tight">
          Wildlife Conservation Assistant
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Upload an image of wildlife to identify the species and learn about its conservation status and threats.
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-6">
            <Alert message={error} type="error" onClose={clearError} />
          </div>
        )}

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
          <ImageUploader
            onImageSelect={handleImageSelect}
            isLoading={isLoading}
            onIdentify={handleIdentify}
            selectedImageName={selectedFile?.name || null}
          />
          {previewUrl && !identificationResult && !isLoading && (
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Image Preview</h3>
              <img src={previewUrl} alt="Selected preview" className="max-w-md max-h-96 mx-auto rounded-lg shadow-lg" />
            </div>
          )}
        </div>
        
        {isLoading && (
            <div className="mt-10 flex flex-col items-center justify-center text-green-600">
                <Spinner size="lg" />
                <p className="mt-3 text-lg font-medium">Analyzing image, please wait...</p>
            </div>
        )}

        {identificationResult && previewUrl && !isLoading && (
          <ResultCard speciesData={identificationResult} imageUrl={previewUrl} />
        )}

      </main>

      <footer className="text-center mt-12 py-6 border-t border-green-200">
        <p className="text-sm text-gray-500">
          Information provided is for educational purposes. Always consult with experts for critical conservation decisions.
        </p>
         <p className="text-xs text-gray-400 mt-1">
           API Key status: {process.env.API_KEY ? 'Detected (check console for validity)' : 'Not Detected (app may not function)'}
        </p>
      </footer>
    </div>
  );
};

export default App;
