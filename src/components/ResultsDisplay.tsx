// src/components/ResultsDisplay.tsx
import React from 'react';
import { SearchResult } from '../types';

interface ResultsDisplayProps {
  results: SearchResult[];
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Web Results</h2>
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg mb-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Web Results</h2>
      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.position} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <a 
              href={result.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg text-blue-600 hover:underline font-medium block mb-1"
            >
              {result.title}
            </a>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="mr-2">{result.source}</span>
              {result.time && (
                <>
                  <span className="mr-2">•</span>
                  <span>{result.time}</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-700">{result.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;