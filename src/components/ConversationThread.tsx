'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { SearchInterface } from './SearchInterface';
import { SuggestionChips } from './SuggestionChips';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from '@/lib/store';

interface ConversationThreadProps {
  conversation: Conversation;
}

export function ConversationThread({ conversation }: ConversationThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const lastAssistantMessage = conversation.messages
    .slice()
    .reverse()
    .find(m => m.role === 'assistant' && !m.isLoading);

  const handleFollowupQuestion = (_question: string) => {
    // This will be handled by the SearchInterface component
    // The question will be set in the search input
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {conversation.messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={index === conversation.messages.length - 1}
              />
            ))}
            
            {/* Follow-up Questions */}
            {lastAssistantMessage?.followupQuestions && lastAssistantMessage.followupQuestions.length > 0 && (
              <div className="mt-8">
                <SuggestionChips
                  suggestions={lastAssistantMessage.followupQuestions}
                  onSelect={handleFollowupQuestion}
                  title="Related questions"
                />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Search Interface */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-6">
        <SearchInterface 
          placeholder="Ask a follow-up question..."
        />
      </div>
    </div>
  );
}