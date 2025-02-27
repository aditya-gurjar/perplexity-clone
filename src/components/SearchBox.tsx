import React, { useState } from 'react';

interface SearchBoxProps {
  onSearch: (query: string, enhanced: boolean) => void;
  isLoading: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [enhanced, setEnhanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, enhanced);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enhanced"
            checked={enhanced}
            onChange={(e) => setEnhanced(e.target.checked)}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="enhanced" className="text-sm text-gray-700">
            Enhanced mode (deeper analysis of top results)
          </label>
        </div>
        <p className="text-sm text-gray-500">
          Ask a question or enter a search term to get AI-powered responses with citations
        </p>
      </form>
    </div>
  );
};

export default SearchBox;