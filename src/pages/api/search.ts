import type { NextApiRequest, NextApiResponse } from 'next';
import { searchWithSerpApi } from '../../services/serpApi';
import { SearchResponse } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      query: '', 
      results: [], 
      status: 'error', 
      message: 'Method not allowed' 
    });
  }

  const { q } = req.query;
  
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ 
      query: '', 
      results: [], 
      status: 'error', 
      message: 'Query parameter "q" is required' 
    });
  }

  try {
    const results = await searchWithSerpApi(q);
    return res.status(200).json({
      query: q,
      results,
      status: 'success'
    });
  } catch (error) {
    console.error('Search API error:', error);
    return res.status(500).json({
      query: q,
      results: [],
      status: 'error',
      message: 'Failed to fetch search results'
    });
  }
}