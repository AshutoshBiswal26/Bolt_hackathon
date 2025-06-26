
export interface SpeciesData {
  speciesName: string;
  scientificName: string;
  isEndangeredStatus: string; // e.g., 'Critically Endangered', 'Endangered', 'Vulnerable', 'Unknown'
  confidence: string; // 'High', 'Medium', 'Low'
  conservationSummary: string;
  commonThreats: string;
}

// Props for components
export interface ImageUploaderProps {
  onImageSelect: (file: File, previewUrl: string) => void;
  isLoading: boolean;
  onIdentify: () => void;
  selectedImageName: string | null;
}

export interface ResultCardProps {
  speciesData: SpeciesData | null;
  imageUrl: string | null;
}

export interface AlertProps {
  message: string;
  type: 'error' | 'info' | 'success' | 'warning';
  onClose?: () => void;
}

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  // Other types of chunks can be added here if needed
}
