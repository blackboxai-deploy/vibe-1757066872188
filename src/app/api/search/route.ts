import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai-client';
import { sourceFetcher } from '@/lib/source-fetcher';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Fetch sources from web
    console.log('Fetching sources for query:', query);
    const { sources } = await sourceFetcher.searchWeb(query, 6);
    
    // Get AI response with sources
    console.log('Getting AI response with sources...');
    const searchResponse = await aiClient.searchQuery(query, sources);

    return NextResponse.json({
      query: searchResponse.query,
      answer: searchResponse.answer,
      sources: searchResponse.sources,
      followupQuestions: searchResponse.followupQuestions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process search query',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Search API endpoint. Use POST method to search.',
      endpoints: {
        POST: '/api/search - Search for information with AI-powered answers'
      }
    },
    { status: 200 }
  );
}