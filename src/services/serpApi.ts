import axios from 'axios';
import { SearchResponse, SearchResult } from '../types';

export async function searchWithSerpApi(query: string): Promise<SearchResult[]> {
  try {
    const params = {
      q: query,
      api_key: process.env.SERPAPI_API_KEY,
      engine: 'google',
    };

    const response = await axios.get('https://serpapi.com/search', { params });
    
    // Extract organic results
    const organicResults = response.data.organic_results || [];
    
    // filter out only the first 5 results
    // const filteredResults = organicResults.slice(0, 5);
    // Map to our SearchResult format
    return organicResults.map((result: any, index: number) => ({
      position: index + 1,
      title: result.title,
      link: result.link,
      snippet: result.snippet,
      source: new URL(result.link).hostname.replace('www.', ''),
      time: result.date,
    }));
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
}