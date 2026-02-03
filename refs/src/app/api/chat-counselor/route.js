/**
 * Chat Counselor API
 * 3ステップアーキテクチャ版（マツコAI）
 */

import OpenAI from 'openai';
import { analyzeUserTurn } from './analysis/analyzer.js';
import { computeResponsePolicy } from './policy/decision.js';
import { generateResponse } from './generation/generator.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message, conversationHistory, userProfile } = await request.json();
    
    if (!message || !message.trim()) {
      return Response.json({ error: "メッセージが必要です" }, { status: 400 });
    }

    // デフォルトのユーザープロファイルとセッション状態
    const defaultUserProfile = {
      user_id: userProfile?.user_id || 'default',
      relationship_level: "new",
      detail_preference: "normal",
      pace_preference: "normal",
      tone_preference: "calm",
      style_preference: {
        empathy: "mid",
        questions: "mid",
        advice: "when_asked"
      }
    };

    const defaultSessionState = {
      session_id: generateSessionId(),
      user_id: defaultUserProfile.user_id,
      conversation_goal: "vent_emotion",
      stage: "venting",
      relationship_mood: "safe",
      default_tone_for_session: "calm",
      summary: "",
      last_turn_id: ""
    };

    // ==========================================
    // Step1: 解析（Analysis LLM）
    // ==========================================
    const turnAnalysis = await analyzeUserTurn(
      message,
      conversationHistory,
      defaultSessionState,
      defaultUserProfile
    );

    console.log('[Step1] Turn Analysis:', JSON.stringify(turnAnalysis, null, 2));

    // ==========================================
    // Step2: ポリシー決定（Rule-based）
    // ==========================================
    const responsePolicy = computeResponsePolicy(
      defaultUserProfile,
      defaultSessionState,
      turnAnalysis
    );

    console.log('[Step2] Response Policy:', JSON.stringify(responsePolicy, null, 2));

    // ==========================================
    // Step3: 返答生成（Generation LLM）
    // ==========================================
    const generationResult = await generateResponse(
      responsePolicy,
      turnAnalysis,
      message,
      conversationHistory,
      userProfile
    );

    if (!generationResult.success) {
      throw new Error(generationResult.error || '返答生成に失敗しました');
    }

    console.log('[Step3] Generated Response:', generationResult.response);

    // ==========================================
    // レスポンス返却
    // ==========================================
    return Response.json({
      success: true,
      userMessage: message,
      aiResponse: generationResult.response,
      conversationId: generateConversationId(),
      timestamp: new Date().toISOString(),
      metadata: {
        tokensUsed: generationResult.metadata?.tokensUsed || 0,
        model: "gpt-4",
        responseType: "conversational_counseling",
        architecture: "3-step",
        turnAnalysis: turnAnalysis,
        responsePolicy: responsePolicy
      }
    });

  } catch (error) {
    console.error('Chat Counselor API Error:', error);
    
    if (error.code === 'insufficient_quota') {
      return Response.json({
        error: "OpenAI APIの利用制限に達しました",
        fallback: generateFallbackChatResponse()
      }, { status: 429 });
    }
    
    return Response.json({ 
      error: "会話型相談の処理に失敗しました",
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    message: "Chat Counselor API (3-Step Architecture)",
    description: "3ステップアーキテクチャで動作するマツコAI相談システム",
    architecture: {
      step1: "Analysis LLM - ユーザー発話の解析（content_intent, stance, tone, emotion等）",
      step2: "Policy Decision - ルールベースでポリシー決定（文量、質問、アドバイス可否等）",
      step3: "Generation LLM - ポリシーに基づいてマツコ風返答生成"
    },
    endpoints: {
      POST: {
        description: "会話型相談セッション",
        parameters: {
          message: "ユーザーのメッセージ（必須）",
          conversationHistory: "会話履歴の配列（任意）",
          userProfile: "ユーザーの基本情報（任意）"
        }
      }
    },
    examples: {
      input: {
        message: "最近仕事がうまくいかなくて悩んでいます",
        conversationHistory: [
          { role: "user", content: "こんにちは" },
          { role: "assistant", content: "どうしたの？" }
        ],
        userProfile: {
          name: "太郎さん",
          age: "20代"
        }
      }
    }
  });
}

function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateConversationId() {
  return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateFallbackChatResponse() {
  const responses = [
    "ちょっと今忙しくてね",
    "ごめんね、今手が離せないの",
    "悪いけど今すぐは無理なのよ",
    "今ちょっと対応できないの",
    "そうね",
    "まぁね"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}
