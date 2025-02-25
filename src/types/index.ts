export interface SearchResult {
    position: number;
    title: string;
    link: string;
    snippet: string;
    source: string;
    time?: string;
}
  
  export interface SearchResponse {
    query: string;
    results: SearchResult[];
    status: 'success' | 'error';
    message?: string;
}
  
  export interface AIResponseData {
    response: string;
    citations: Citation[];
}
  
  export interface Citation {
    id: number;
    text: string;
    source: string;
    link: string;
}
  
  export interface CombinedResponse {
    query: string;
    aiResponse: AIResponseData;
    searchResults: SearchResult[];
    status: 'success' | 'error';
    message?: string;
}