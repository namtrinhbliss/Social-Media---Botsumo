import React from 'react';
import { ExternalLink } from 'lucide-react';

interface SheetViewerProps {
  url: string;
}

export const SheetViewer: React.FC<SheetViewerProps> = ({ url }) => {
  // Helper to extract Sheet ID and construct clean embed URL
  const getEmbedUrl = (rawUrl: string): string => {
    try {
      // Regex to find the ID between /d/ and /
      const match = rawUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        const id = match[1];
        // We force 'edit' mode in the URL parameters.
        // Google Sheets handles permissions internally. 
        // If the user has edit rights, this URL will allow editing.
        return `https://docs.google.com/spreadsheets/d/${id}/edit?usp=sharing&rm=demo`; 
      }
      return rawUrl;
    } catch (e) {
      return rawUrl;
    }
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100 relative overflow-hidden">
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
      <iframe
        src={embedUrl}
        title="Google Sheet"
        className="w-full h-full border-0"
        allow="clipboard-write" // Important for copy-paste inside the sheet
      />
    </div>
  );
};