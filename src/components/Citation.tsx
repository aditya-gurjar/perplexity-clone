import React from 'react';
import { Citation as CitationType } from '../types';

interface CitationProps {
  citation: CitationType;
}

const Citation: React.FC<CitationProps> = ({ citation }) => {
  return (
    <div 
      id={`citation-${citation.id}`}
      className="flex gap-2 p-2 border-l-4 border-blue-500 bg-gray-50 mb-2"
    >
      <span className="font-bold text-blue-600">[{citation.id}]</span>
      <div>
        <p className="text-sm text-gray-700">{citation.text}</p>
        <a 
          href={citation.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          {citation.source}
        </a>
      </div>
    </div>
  );
};

export default Citation;