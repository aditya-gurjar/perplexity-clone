import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { AIResponseData, Citation } from '../types';

interface AIResponseProps {
  data: AIResponseData;
  isLoading: boolean;
}

const AIResponse: React.FC<AIResponseProps> = ({ data, isLoading }) => {
  const processedText = useMemo(() => {
    if (!data?.response) return '';
    
    // Process the response text to make citation numbers clickable
    let text = data.response;
    data.citations.forEach(citation => {
      // Match only numbers wrapped in square brackets
      const citationMarker = `\\[${citation.id}\\]`;
      text = text.replace(
        new RegExp(citationMarker, 'g'), 
        `[${citation.id}](#citation-${citation.id})`  // Use markdown link syntax
      );
    });
    
    return text;
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm mb-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-4/6"></div>
      </div>
    );
  }

  if (!data || !data.response) {
    return null;
  }

  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-md mb-8 w-full">
      <h2 className="text-xl font-semibold mb-4">AI Response</h2>
      <div className="prose prose-lg w-full max-w-none">
        <ReactMarkdown components={{
          a: ({ node, children, href, ...props }) => {
            // Extract citation ID from href
            const citationId = href?.match(/citation-(\d+)/)?.[1];
            const citation = citationId ? data.citations.find(c => c.id.toString() === citationId) : null;
            
            return (
              <a 
                href={href} 
                title={citation?.link} 
                className="text-blue-600 hover:underline"
                {...props}
              >
                [{children}]
              </a>
            );
          }
        }}>
          {processedText}
        </ReactMarkdown>
      </div>
      
      {data.citations.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-2">Citations</h3>
          <div className="space-y-2">
            {data.citations.map(citation => (
              <div 
                key={citation.id} 
                id={`citation-${citation.id}`}
                className="flex gap-2 p-2 border-l-4 border-blue-500 bg-gray-50"
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResponse;