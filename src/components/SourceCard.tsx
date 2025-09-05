'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Source } from '@/lib/store';

interface SourceCardProps {
  source: Source;
  index?: number;
}

export function SourceCard({ source, index }: SourceCardProps) {
  const handleSourceClick = () => {
    window.open(source.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="group cursor-pointer hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Source Number */}
          {index !== undefined && (
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center mt-0.5">
              {index}
            </div>
          )}

          {/* Favicon */}
          <div className="flex-shrink-0 w-4 h-4 mt-1">
            {source.favicon ? (
              <img
                src={source.favicon}
                alt={`${source.domain} favicon`}
                className="w-4 h-4 rounded-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-sm flex items-center justify-center">
                <span className="text-[8px] font-medium text-gray-600 dark:text-gray-300">
                  {source.domain.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {source.title}
              </h3>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
              {source.snippet}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="truncate max-w-32">{source.domain}</span>
                {source.publishedDate && (
                  <>
                    <span>•</span>
                    <span>{formatDate(source.publishedDate)}</span>
                  </>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSourceClick();
                }}
              >
                Open
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  } catch {
    return dateString;
  }
}