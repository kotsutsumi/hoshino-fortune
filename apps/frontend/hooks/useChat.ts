import { useAtom } from 'jotai';
import { useCallback } from 'react';
import {
  chatMessagesAtom,
  chatLoadingAtom,
  chatErrorAtom,
  ChatMessage,
} from '../lib/store';
import { getApiBaseUrl } from '@hoshino/api';

interface ChatApiResponse {
  response: string;
  analysis: {
    emotion: string;
    intent: string;
    keywords: string[];
    topic: string;
  };
  timestamp: string;
}

export function useChat() {
  const [messages, setMessages] = useAtom(chatMessagesAtom);
  const [loading, setLoading] = useAtom(chatLoadingAtom);
  const [error, setError] = useAtom(chatErrorAtom);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || loading) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/chat-counselor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ChatApiResponse = await response.json();

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp,
      };

      // Add assistant message to chat
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError({
        code: 'CHAT_ERROR',
        message: 'メッセージの送信に失敗しました。しばらくしてからお試しください。',
        retryable: true,
      });

      // Add fallback message
      const fallbackMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: 'あら、ちょっと調子悪いみたいね...。もう一度話しかけてみて！',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, setMessages, setLoading, setError]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, [setMessages, setError]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
    clearError,
  };
}
