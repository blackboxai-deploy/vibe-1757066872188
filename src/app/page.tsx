'use client';

import { useState } from 'react';
import { SearchInterface } from '@/components/SearchInterface';
import { ConversationThread } from '@/components/ConversationThread';
import { Sidebar } from '@/components/Sidebar';
import { useConversationStore } from '@/lib/store';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentConversation, conversations } = useConversationStore();

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300"></div>
                <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300"></div>
                <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300"></div>
              </div>
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Perplexity Clone
            </h1>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            AI-Powered Search & Answers
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          {currentConversation ? (
            <ConversationThread conversation={currentConversation} />
          ) : (
            <div className="h-full flex flex-col">
              {/* Welcome Section */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                      Where knowledge begins
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                      Ask anything, get comprehensive answers with sources
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mt-12">
                    {[
                      {
                        title: "Latest Technology Trends",
                        description: "What are the most significant developments in AI and technology?",
                        icon: "🚀"
                      },
                      {
                        title: "Scientific Discoveries",
                        description: "Recent breakthroughs in medicine and space exploration",
                        icon: "🔬"
                      },
                      {
                        title: "Business & Finance",
                        description: "Market trends and economic insights for informed decisions",
                        icon: "📊"
                      },
                      {
                        title: "Learning & Education",
                        description: "Comprehensive guides and explanations on any topic",
                        icon: "📚"
                      }
                    ].map((item, index) => (
                      <div key={index} className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer group">
                        <div className="text-2xl mb-3">{item.icon}</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search Interface */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                <SearchInterface />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}