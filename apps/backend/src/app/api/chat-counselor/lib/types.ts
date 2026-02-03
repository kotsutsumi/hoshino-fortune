import { z } from "zod";

// 感情カテゴリ（4種類に簡略化）
export const EMOTION_CATEGORIES = ['positive', 'negative', 'anxious', 'neutral'] as const;
export type EmotionCategory = typeof EMOTION_CATEGORIES[number];

// 意図タイプ（5種類に簡略化）
export const INTENT_TYPES = ['consultation', 'venting', 'question', 'greeting', 'gratitude'] as const;
export type IntentType = typeof INTENT_TYPES[number];

// メッセージ分析結果
export interface MessageAnalysis {
  emotion: EmotionCategory;
  intent: IntentType;
  keywords: string[];
  topic: string;
}

// 応答ポリシー
export interface ResponsePolicy {
  tone: 'supportive' | 'direct' | 'playful' | 'empathetic';
  responseLength: 'short' | 'medium' | 'long';
  includeAdvice: boolean;
  includeEncouragement: boolean;
}

// チャットメッセージ
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// リクエストスキーマ
export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.string(),
  })).optional().default([]),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// レスポンス
export interface ChatResponse {
  response: string;
  analysis: MessageAnalysis;
  timestamp: string;
}
