import type { NextApiRequest, NextApiResponse } from 'next';
import { searchWithSerpApi } from '../../services/serpApi';
import { generateAIResponse } from '../../services/openAiService';
import { CombinedResponse } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CombinedResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      query: '', 
      aiResponse: { response: '', citations: [] }, 
      searchResults: [],
      status: 'error', 
      message: 'Method not allowed' 
    });
  }

  const { q } = req.query;
  
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ 
      query: '', 
      aiResponse: { response: '', citations: [] }, 
      searchResults: [],
      status: 'error', 
      message: 'Query parameter "q" is required' 
    });
  }

  try {
    // Step 1: Get search results
    const searchResults = await searchWithSerpApi(q);
    
    // Step 2: Generate AI response based on search results
    const aiResponse = await generateAIResponse(q, searchResults);
    
    // Step 3: Return combined response
    return res.status(200).json({
      query: q,
      aiResponse,
      searchResults,
      status: 'success'
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return res.status(500).json({
      query: q,
      aiResponse: { response: '', citations: [] },
      searchResults: [],
      status: 'error',
      message: 'Failed to generate response'
    });
  }
}