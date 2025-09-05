'use client';

import { useState, useEffect } from 'react';
import { SourceCard } from './SourceCard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Message } from '@/lib/store';

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.role === 'assistant' && message.content && !message.isLoading) {
      // Simulate typing animation for assistant messages
      setIsTyping(true);
      setDisplayedContent('');
      
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < message.content.length) {
          setDisplayedContent(message.content.slice(0, i + 1));
          i++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
        }
      }, 20);

      return () => clearInterval(typeInterval);
    } else {
      setDisplayedContent(message.content);
      setIsTyping(false);
    }
  }, [message.content, message.role, message.isLoading]);

  if (message.isLoading) {
    return (
      <div className="flex gap-4 items-start">
        <Avatar className="w-8 h-8 bg-blue-600">
          <AvatarFallback className="text-white text-sm">AI</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Searching...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-start group">
      {/* Avatar */}
      <Avatar className={`w-8 h-8 ${message.role === 'user' ? 'bg-gray-600' : 'bg-blue-600'}`}>
        <AvatarFallback className="text-white text-sm">
          {message.role === 'user' ? 'You' : 'AI'}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className="flex-1 space-y-3">
        {/* Message Text */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
            {displayedContent}
          </div>
          {isTyping && (
            <span className="inline-block w-0.5 h-4 bg-blue-600 animate-pulse ml-1" />
          )}
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Sources
              </span>
              <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {message.sources.map((source) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Message Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => navigator.clipboard.writeText(message.content)}
          >
            Copy
          </Button>
          {message.role === 'assistant' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Good
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Bad
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}