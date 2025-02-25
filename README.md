# AI Search Assistant

A Next.js application that combines web search with AI-powered responses, similar to Perplexity AI. The application searches the web for relevant information and generates comprehensive answers with citations.

## Features

- Web search using SerpAPI
- AI-powered responses using OpenAI GPT-4
- Two response modes:
  - Basic: Quick responses based on search snippets
  - Enhanced: Deeper analysis using full webpage content
- Citation support with clickable references
- Clean, responsive UI

## Tech Stack

- Next.js
- TypeScript
- OpenAI API
- SerpAPI
- Firecrawl API (for enhanced mode)
- Tailwind CSS

## Environment Variables

Create a `.env.local` file with the following:

```
FIRECRAWL_API_KEY=your_firecrawl_api_key
OPENAI_API_KEY=your_openai_api_key
SERP_API_KEY=your_serp_api_key
```

## Setup

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npm run dev` to start the development server

## Usage

1. Open the development server
2. Enter a query in the search bar
3. Select the response mode (Basic or Enhanced)
4. Click the search button
5. The AI will generate a response based on the search results

## Future Improvements

1. Add user authentication and chat history
2. Cache most used recent queries
3. Add streaming to responses
4. Multimedia queires and responses
