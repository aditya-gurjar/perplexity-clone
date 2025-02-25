import OpenAI from 'openai';
import { AIResponseData, SearchResult } from '../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIResponse(
  query: string, 
  searchResults: SearchResult[]
): Promise<AIResponseData> {
  try {
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
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}