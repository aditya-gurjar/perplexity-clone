import OpenAI from 'openai';
import { AIResponseData, SearchResult } from '../types';
import { scrapeWebPages } from './firecrawlService';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIResponse(
  query: string, 
  searchResults: SearchResult[],
  enhanced: boolean = false
): Promise<AIResponseData> {
  try {
    if (!enhanced) {
      return await generateBasicResponse(query, searchResults);
    } else {
      return await generateEnhancedResponse(query, searchResults);
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}

async function generateBasicResponse(
  query: string,
  searchResults: SearchResult[]
): Promise<AIResponseData> {
  // Format search results for the prompt
  const formattedResults = searchResults
    .map(result => `[${result.position}] "${result.title}": ${result.snippet} (Source: ${result.source}, Link: ${result.link})`)
    .join('\n\n');

  // Build the prompt
  const prompt = `
I need you to answer the following query using ONLY the information provided in the search results below.

Query: "${query}"

Search Results:
${formattedResults}

Instructions:
1. Answer the question based ONLY on the information in the search results.
2. Cite your sources using the format [X] where X is the search result number.
3. If you cannot answer the question with the provided information, state that clearly.
4. Structure your response in a clear, concise manner.
5. Provide citations for ALL facts and information.
6. For each citation, use EXACTLY the same link that was provided in the search result.
6. Return the response in the following JSON format:
{
  "response": "Your detailed answer with citation markers [X]",
  "citations": [
    {
      "id": X,
      "text": "The exact text portion you're citing",
      "source": "source name",
      "link": "The exact link from the search result"
    },
    ...
  ]
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that answers questions based only on the provided search results. Your responses should be well-structured with appropriate citations."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
  });

  const responseContent = response.choices[0].message.content || '';
  try {
    const parsedResponse = JSON.parse(responseContent) as AIResponseData;
    console.log(parsedResponse); // debugging
    return parsedResponse;
  } catch (parseError) {
    console.error("Failed to parse OpenAI response as JSON:", parseError);
    return {
      response: "Sorry, there was an error processing the AI response.",
      citations: []
    };
  }
}

async function generateEnhancedResponse(
  query: string,
  searchResults: SearchResult[]
): Promise<AIResponseData> {
  // 1. First, get top 3 most relevant results
  const topResults = await rankResults(query, searchResults.slice(0, 5));
  const top3Results = topResults.slice(0, 3);

  // 2. Scrape the content from these URLs
  const scrapedContents = await scrapeWebPages(top3Results.map(r => r.link));

  // 3. Format the content for the prompt
  const formattedContent = scrapedContents
    .map((content, idx) => `[${idx + 1}] Source: ${content.url}\nTitle: ${content.title}\nContent: ${content.content}`)
    .join('\n\n');

  // 4. Generate enhanced response
  const prompt = `
I need you to provide a detailed answer to the following query using the provided document contents.

Query: "${query}"

Documents:
${formattedContent}

Instructions:
1. Provide a comprehensive answer using ONLY the information from these documents.
2. Cite your sources using the format [X] where X is the document number.
3. Structure your response in a clear, detailed manner with multiple paragraphs if needed.
4. Provide citations for ALL facts and information.
5. If certain aspects cannot be answered from the provided documents, state that clearly.
6. Return the response in the following JSON format:
{
  "response": "Your detailed answer with citation markers [X]",
  "citations": [
    {
      "id": X,
      "text": "The exact text portion you're citing",
      "source": "source name",
      "link": "The exact URL from the document"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that provides detailed, well-researched answers based on provided document contents. Your responses should be comprehensive and well-structured with appropriate citations."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
  });

  const responseContent = response.choices[0].message.content || '';
  return JSON.parse(responseContent) as AIResponseData;
}

async function rankResults(
  query: string, 
  results: SearchResult[]
): Promise<SearchResult[]> {
  const prompt = `
Given the following search query and results, rank the results by relevance (1-5) 
and return only the array of result indices in order of relevance.

Query: "${query}"

Results:
${results.map((r, i) => `${i}: ${r.title}\n${r.snippet}`).join('\n\n')}

Return only a JSON array of indices, like: [1,4,2,0,3] in order of higher to lower relevance.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that ranks search results by relevance."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
  });

  const rankedIndices = JSON.parse(response.choices[0].message.content || '[]');
  return rankedIndices.map((idx: number) => results[idx]);
}