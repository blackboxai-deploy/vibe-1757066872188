import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  followupQuestions?: string[];
  timestamp: Date;
  isLoading?: boolean;
}

export interface Source {
  id: number;
  title: string;
  url: string;
  snippet: string;
  favicon?: string;
  publishedDate?: string;
  domain: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  
  // Actions
  createConversation: (firstMessage: string) => string;
  setCurrentConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  clearCurrentConversation: () => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversation: null,
      isLoading: false,

      createConversation: (firstMessage: string) => {
        const id = generateId();
        const conversation: Conversation = {
          id,
          title: truncateText(firstMessage, 50),
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversation: conversation
        }));

        return id;
      },

      setCurrentConversation: (id: string) => {
        const conversation = get().conversations.find(c => c.id === id);
        if (conversation) {
          set({ currentConversation: conversation });
        }
      },

      addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date()
        };

        set((state) => {
          const updatedConversations = state.conversations.map(conv => {
            if (conv.id === conversationId) {
              const updatedConv = {
                ...conv,
                messages: [...conv.messages, newMessage],
                updatedAt: new Date()
              };
              return updatedConv;
            }
            return conv;
          });

          const currentConv = state.currentConversation?.id === conversationId
            ? updatedConversations.find(c => c.id === conversationId) || null
            : state.currentConversation;

          return {
            conversations: updatedConversations,
            currentConversation: currentConv
          };
        });
      },

      updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => {
        set((state) => {
          const updatedConversations = state.conversations.map(conv => {
            if (conv.id === conversationId) {
              const updatedMessages = conv.messages.map(msg => {
                if (msg.id === messageId) {
                  return { ...msg, ...updates };
                }
                return msg;
              });
              return { ...conv, messages: updatedMessages, updatedAt: new Date() };
            }
            return conv;
          });

          const currentConv = state.currentConversation?.id === conversationId
            ? updatedConversations.find(c => c.id === conversationId) || null
            : state.currentConversation;

          return {
            conversations: updatedConversations,
            currentConversation: currentConv
          };
        });
      },

      clearCurrentConversation: () => {
        set({ currentConversation: null });
      },

      deleteConversation: (id: string) => {
        set((state) => {
          const updatedConversations = state.conversations.filter(c => c.id !== id);
          const currentConv = state.currentConversation?.id === id 
            ? null 
            : state.currentConversation;

          return {
            conversations: updatedConversations,
            currentConversation: currentConv
          };
        });
      },

      renameConversation: (id: string, title: string) => {
        set((state) => {
          const updatedConversations = state.conversations.map(conv => 
            conv.id === id ? { ...conv, title, updatedAt: new Date() } : conv
          );

          const currentConv = state.currentConversation?.id === id
            ? updatedConversations.find(c => c.id === id) || null
            : state.currentConversation;

          return {
            conversations: updatedConversations,
            currentConversation: currentConv
          };
        });
      }
    }),
    {
      name: 'perplexity-conversations',
      partialize: (state) => ({
        conversations: state.conversations
      })
    }
  )
);

// Utility functions
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}