import React, { useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

interface SheetViewerProps {
  url: string;
}

export const SheetViewer: React.FC<SheetViewerProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Helper to extract Sheet ID and construct clean embed URL
  const getEmbedUrl = (rawUrl: string): string => {
    try {
      // Regex to find the ID between /d/ and /
      const match = rawUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        const id = match[1];
        // We use the standard edit URL to ensure the user has access to the full toolbar (File, Edit, View, etc.)
        // usp=sharing ensures the sharing context is maintained.
        return `https://docs.google.com/spreadsheets/d/${id}/edit?usp=sharing`; 
      }
      return rawUrl;
    } catch (e) {
      return rawUrl;
    }
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100 relative overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
            <div className="flex flex-col items-center gap-3 animate-pulse">
                <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                <p className="text-gray-500 font-medium">Loading Spreadsheet...</p>
            </div>
        </div>
      )}

      {/* External Link Button */}
      <div className="absolute top-4 right-4 z-10">
        <a 
          href={embedUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white/90 backdrop-blur text-xs font-medium text-gray-600 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 flex items-center gap-1 hover:text-green-600 hover:border-green-300 transition-all"
        >
          Open in New Tab <ExternalLink size={12} />
        </a>
      </div>
      
      {/* Google Sheet Iframe */}
      <iframe
        src={embedUrl}
        title="Google Sheet"
        className="w-full h-full border-0"
        allow="clipboard-write; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};