
import React from 'react';
import { ResultCardProps } from '../types';

const getStatusColor = (status: string): string => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('critically endangered')) return 'bg-red-700 text-red-100';
  if (lowerStatus.includes('endangered')) return 'bg-red-500 text-white';
  if (lowerStatus.includes('vulnerable')) return 'bg-yellow-500 text-yellow-900';
  if (lowerStatus.includes('near threatened')) return 'bg-yellow-300 text-yellow-800';
  if (lowerStatus.includes('least concern')) return 'bg-green-500 text-white';
  if (lowerStatus.includes('data deficient')) return 'bg-gray-400 text-gray-800';
  return 'bg-gray-500 text-white'; // Default for 'Unknown' or other statuses
};

const getConfidenceColor = (confidence: string): string => {
  const lowerConfidence = confidence.toLowerCase();
  if (lowerConfidence === 'high') return 'text-green-600';
  if (lowerConfidence === 'medium') return 'text-yellow-600';
  if (lowerConfidence === 'low') return 'text-red-600';
  return 'text-gray-600';
};

const ResultCard: React.FC<ResultCardProps> = ({ speciesData, imageUrl }) => {
  if (!speciesData || !imageUrl) {
    return null; // Don't render if no data
  }

  const { speciesName, scientificName, isEndangeredStatus, confidence, conservationSummary, commonThreats } = speciesData;

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden mt-8">
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-1/2">
          <img 
            className="h-64 w-full object-cover md:h-full" 
            src={imageUrl} 
            alt={speciesName !== 'Unknown' ? `Uploaded image, identified as ${speciesName}` : "Uploaded image, species not identified"} 
          />
        </div>
        <div className="p-6 md:p-8 flex-grow md:w-1/2">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold text-green-800 tracking-tight">
              {speciesName === 'Unknown' ? 'Species Not Clearly Identified' : speciesName}
            </h2>
            {speciesName !== 'Unknown' && isEndangeredStatus !== 'Unknown' && (
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(isEndangeredStatus)}`}>
                {isEndangeredStatus}
              </span>
            )}
          </div>

          {speciesName !== 'Unknown' && scientificName && scientificName !== 'N/A' && (
            <p className="text-md text-gray-500 italic mt-1">{scientificName}</p>
          )}

          {speciesName !== 'Unknown' && confidence && (
            <p className="text-sm mt-2">
              Identification Confidence: <span className={`font-semibold ${getConfidenceColor(confidence)}`}>{confidence}</span>
            </p>
          )}
          
          {speciesName === 'Unknown' && isEndangeredStatus === 'Unknown' && (
             <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(isEndangeredStatus)}`}>
                Status: {isEndangeredStatus}
              </span>
          )}


          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-green-700">Conservation Summary</h3>
              <p className="text-gray-600 mt-1 leading-relaxed">{conservationSummary}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-700">Common Threats</h3>
              <p className="text-gray-600 mt-1 leading-relaxed">{commonThreats}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
