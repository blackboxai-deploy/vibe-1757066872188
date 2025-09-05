'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConversationStore } from '@/lib/store';

interface SearchInterfaceProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchInterface({ 
  onSearch,
  placeholder = "Ask anything...",
  disabled = false
}: SearchInterfaceProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { createConversation, addMessage } = useConversationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || disabled || isSearching) return;

    const searchQuery = query.trim();
    setIsSearching(true);

    try {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        // Create new conversation and add user message
        const conversationId = createConversation(searchQuery);
        addMessage(conversationId, {
          role: 'user',
          content: searchQuery
        });

        // Add loading message for AI response
        addMessage(conversationId, {
          role: 'assistant',
          content: '',
          isLoading: true
        });

        // Trigger API search
        await handleSearch(conversationId, searchQuery);
      }

      setQuery('');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (conversationId: string, searchQuery: string) => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      
      // Update the loading message with actual response
      const conversations = useConversationStore.getState().conversations;
      const conversation = conversations.find(c => c.id === conversationId);
      const loadingMessageId = conversation?.messages.find(m => m.isLoading)?.id;

      if (loadingMessageId) {
        useConversationStore.getState().updateMessage(conversationId, loadingMessageId, {
          content: data.answer,
          sources: data.sources,
          followupQuestions: data.followupQuestions,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('API search error:', error);
      
      // Update loading message with error
      const conversations = useConversationStore.getState().conversations;
      const conversation = conversations.find(c => c.id === conversationId);
      const loadingMessageId = conversation?.messages.find(m => m.isLoading)?.id;

      if (loadingMessageId) {
        useConversationStore.getState().updateMessage(conversationId, loadingMessageId, {
          content: 'I apologize, but I encountered an error while searching. Please try again.',
          isLoading: false
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isSearching}
            className="pr-12 py-6 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-colors"
          />
          <Button
            type="submit"
            disabled={!query.trim() || disabled || isSearching}
            className="absolute right-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </div>
      </form>

      {/* Suggested Questions */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {[
          "What are the latest AI developments?",
          "How does quantum computing work?",
          "Explain climate change solutions",
          "What's happening in space exploration?"
        ].map((suggestion, index) => (
          <button
            key={index}
            onClick={() => setQuery(suggestion)}
            disabled={disabled || isSearching}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}