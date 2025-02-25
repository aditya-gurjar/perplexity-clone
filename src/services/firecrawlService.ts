import FirecrawlApp from '@mendable/firecrawl-js';

interface ScrapedContent {
  url: string;
  content: string;
  title: string;
}

const app = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!
});

export async function scrapeWebPages(urls: string[]): Promise<ScrapedContent[]> {
  try {
    const scrapedContents: ScrapedContent[] = [];

    for (const url of urls) {
      const response = await app.scrapeUrl(url, {
        formats: ['markdown'], // We'll use markdown for cleaner text
      });

      if (!response.success) {
        console.error(`Failed to scrape ${url}: ${response.error}`);
        continue;
      }

      // The response.result contains the scraped content
      scrapedContents.push({
        url,
        content: response.markdown || '',
        title: response.metadata?.title || ''
      });
    }

    return scrapedContents;
  } catch (error) {
    console.error('Error scraping web pages:', error);
    throw error;
  }
} 