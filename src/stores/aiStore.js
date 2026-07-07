// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES AI STORE
// Manages AI-related state and actions
// ═══════════════════════════════════════════════════════════════════════════
// Classification: STARK INDUSTRIES PROPRIETARY
// Author: J.A.R.V.I.S
// Version: 1.0.0
// ═══════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';

export const useAIStore = create((set) => ({
  // State
  openChat: false,
  aiStatus: 'idle', // 'idle', 'processing', 'success', 'error'
  messages: [],
  currentQuery: '',
  
  // Actions
  toggleChat: () => set((state) => ({ 
    openChat: !state.openChat,
    // Reset messages when closing chat
    ...(!state.openChat && { messages: [] })
  })),
  
  setAIStatus: (status) => set({ 
    aiStatus: status,
    // Reset current query when status changes to idle
    ...(status === 'idle' && { currentQuery: '' })
  }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      id: Date.now(),
      content: message.content,
      sender: message.sender, // 'user' or 'ai'
      timestamp: new Date().toISOString()
    }]
  })),
  
  setCurrentQuery: (query) => set({ currentQuery: query }),
  
  // Process user query
  processQuery: async (query) => {
    set({ aiStatus: 'processing' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call your AI API here
      const response = `I understand you're asking about "${query}". This is a simulated response.`;
      
      set((state) => ({
        messages: [
          ...state.messages,
          { id: Date.now(), content: query, sender: 'user', timestamp: new Date().toISOString() },
          { id: Date.now() + 1, content: response, sender: 'ai', timestamp: new Date().toISOString() }
        ],
        currentQuery: '',
        aiStatus: 'success'
      }));
      
      return response;
    } catch (error) {
      console.error('AI processing error:', error);
      set({ aiStatus: 'error' });
      throw error;
    }
  },
  
  // Reset the store
  reset: () => set({ 
    openChat: false,
    aiStatus: 'idle',
    messages: [],
    currentQuery: ''
  })
}));
