'use client';

import { Button } from '@/components/ui/button';

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  title?: string;
  maxVisible?: number;
}

export function SuggestionChips({ 
  suggestions, 
  onSelect, 
  title = "Suggested questions",
  maxVisible = 5 
}: SuggestionChipsProps) {
  const visibleSuggestions = suggestions.slice(0, maxVisible);

  if (visibleSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {title}
          </h4>
          <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {visibleSuggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion)}
            className="text-left h-auto py-2 px-3 text-sm text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors whitespace-normal"
          >
            <span className="block max-w-xs truncate">
              {suggestion}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}