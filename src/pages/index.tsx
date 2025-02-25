import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import SearchBox from '../components/SearchBox';
import AIResponse from '../components/AIResponse';
import ResultsDisplay from '../components/ResultsDisplay';
import { CombinedResponse, AIResponseData, SearchResult } from '../types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAIResponse] = useState<AIResponseData | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    setError(null);
    
    try {
      const response = await axios.get<CombinedResponse>('/api/generate', {
        params: { q: query }
      });
      
      setAIResponse(response.data.aiResponse);
      setSearchResults(response.data.searchResults);
    } catch (error) {
      console.error('Error performing search:', error);
      setError('Failed to get results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Perplexity AI Clone</title>
        <meta name="description" content="A simple Perplexity AI clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Perplexity AI Clone</h1>
          <p className="text-gray-600">Ask questions and get AI-powered answers with citations</p>
        </div>

        <SearchBox onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {(aiResponse || isLoading) && (
          <AIResponse data={aiResponse || { response: '', citations: [] }} isLoading={isLoading} />
        )}

        {(searchResults.length > 0 || isLoading) && (
          <ResultsDisplay results={searchResults} isLoading={isLoading} />
        )}
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Perplexity AI Clone - Built with Next.js</p>
      </footer>
    </div>
  );
}