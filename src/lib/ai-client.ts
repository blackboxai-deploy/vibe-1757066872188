// AI Client Configuration for Custom OpenRouter Endpoint
// Uses custom endpoint with no API keys required

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SearchResponse {
  answer: string;
  sources: Source[];
  followupQuestions: string[];
  query: string;
}

export interface Source {
  id: number;
  title: string;
  url: string;
  snippet: string;
  favicon?: string;
  publishedDate?: string;
}

class AIClient {
  private baseUrl = 'https://oi-server.onrender.com/chat/completions';
  private headers = {
    'customerId': 'ravish.tiwari.newton@gmail.com',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  };

  async searchQuery(query: string, sources: Source[] = []): Promise<SearchResponse> {
    const systemPrompt = `You are an AI search assistant similar to Perplexity AI. Your role is to:

1. Provide comprehensive, accurate answers based on the user's query
2. When sources are provided, cite them using numbered references [1], [2], etc.
3. Generate 3-5 relevant follow-up questions to help users explore the topic deeper
4. Format your response in clear, readable sections
5. Be conversational but authoritative in tone
6. Focus on current, factual information

Response Format:
- Answer the query thoroughly using provided sources
- Include numbered citations when referencing sources
- End with 3-5 follow-up questions

Sources available: ${sources.length > 0 ? sources.map((s, i) => `[${i + 1}] ${s.title} - ${s.snippet}`).join('\n') : 'No external sources provided - use your knowledge base'}`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ];

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: 'openrouter/anthropic/claude-sonnet-4',
          messages,
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiAnswer = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      // Parse the AI response to extract follow-up questions
      const followupQuestions = this.extractFollowupQuestions(aiAnswer);

      return {
        answer: aiAnswer,
        sources: sources,
        followupQuestions,
        query
      };
    } catch (error) {
      console.error('AI Client Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  private extractFollowupQuestions(response: string): string[] {
    // Extract follow-up questions from AI response
    const followupRegex = /(?:follow[- ]?up questions?|related questions?|you might also ask):\s*(.*?)(?:\n\n|\n$|$)/i;
    const match = response.match(followupRegex);
    
    if (match) {
      const questionsText = match[1];
      const questions = questionsText
        .split(/\n|•|-|\d+\./)
        .map(q => q.trim())
        .filter(q => q.length > 10 && q.includes('?'))
        .slice(0, 5);
      
      return questions;
    }

    // Fallback: generate default follow-up questions
    return [
      "Can you provide more details about this topic?",
      "What are the latest developments in this area?",
      "How does this compare to similar topics?",
      "What are the implications of this information?"
    ];
  }

  async generateFollowupQuestions(query: string, context: string): Promise<string[]> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'Generate 4-5 relevant follow-up questions based on the original query and context. Each question should explore different aspects or related topics. Return only the questions, one per line.'
      },
      {
        role: 'user',
        content: `Original query: ${query}\n\nContext: ${context}\n\nGenerate follow-up questions:`
      }
    ];

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: 'openrouter/anthropic/claude-sonnet-4',
          messages,
          temperature: 0.8,
          max_tokens: 300
        })
      });

      const data = await response.json();
      const questionsText = data.choices[0]?.message?.content || '';
      
      return questionsText
        .split('\n')
        .map((q: string) => q.replace(/^\d+\.\s*/, '').trim())
        .filter((q: string) => q.length > 10 && q.includes('?'))
        .slice(0, 5);
    } catch (error) {
      console.error('Error generating follow-up questions:', error);
      return [
        "What are the key benefits of this?",
        "How does this work in practice?",
        "What should I know about this topic?",
        "What are the latest trends related to this?"
      ];
    }
  }
}

export const aiClient = new AIClient();