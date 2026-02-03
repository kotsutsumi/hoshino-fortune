/**
 * Step1: 解析LLM
 * ユーザーの発話を解析し、turn_analysis を生成する
 */

import OpenAI from 'openai';
import { TurnAnalysisSchema } from '../models/schemas.js';
import { ANALYSIS_SYSTEM_PROMPT } from './prompts.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * ユーザー発話を解析
 * @param {string} userMessage - ユーザーの発話
 * @param {Array} conversationHistory - 会話履歴（任意）
 * @param {Object} sessionState - セッション状態（任意）
 * @param {Object} userProfile - ユーザープロファイル（任意）
 * @returns {Promise<Object>} turn_analysis
 */
export async function analyzeUserTurn(userMessage, conversationHistory = [], sessionState = null, userProfile = null) {
  const turnId = generateTurnId();
  
  // Step1用のプロンプトを構築
  const systemPrompt = ANALYSIS_SYSTEM_PROMPT;
  const userPrompt = buildAnalysisUserPrompt(userMessage, conversationHistory, sessionState);
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1,  // 解析は低めの温度で安定させる（0〜0.2推奨）
      max_tokens: 500
    });
    
    const analysisText = completion.choices[0].message.content;
    const analysis = parseAnalysisResponse(analysisText);
    
    // turn_id、session_id、user_id を追加
    analysis.turn_id = turnId;
    analysis.session_id = sessionState?.session_id || 'default';
    analysis.user_id = userProfile?.user_id || 'default';
    analysis.created_at = new Date().toISOString();
    
    return analysis;
    
  } catch (error) {
    console.error('Analysis Error:', error);
    // エラー時はデフォルトの解析結果を返す
    return createDefaultAnalysis(turnId, userMessage, sessionState, userProfile);
  }
}

/**
 * 解析用ユーザープロンプトを構築
 */
function buildAnalysisUserPrompt(userMessage, conversationHistory, sessionState) {
  let prompt = '以下は、ユーザーとAIアシスタントの最近の会話ログです。\n';
  prompt += '最後の「ユーザー」の発話に対してのみ、先ほどのルールに従って解析を行ってください。\n\n';
  
  if (conversationHistory && conversationHistory.length > 0) {
    prompt += '[会話ログ]\n';
    conversationHistory.slice(-5).forEach((msg) => {
      const speaker = msg.role === 'user' ? 'ユーザー' : 'アシスタント';
      prompt += `${speaker}: ${msg.content}\n`;
    });
    prompt += '\n';
  }
  
  prompt += '[今回解析する発話]\n';
  prompt += `ユーザー: ${userMessage}\n`;
  
  return prompt;
}

/**
 * LLMの解析レスポンスをパース
 */
function parseAnalysisResponse(responseText) {
  try {
    // JSONを抽出（コードブロックで囲まれている場合も対応）
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (error) {
    console.error('Failed to parse analysis response:', error);
    throw error;
  }
}

/**
 * デフォルトの解析結果を生成（エラー時のフォールバック）
 */
function createDefaultAnalysis(turnId, userMessage, sessionState = null, userProfile = null) {
  return {
    turn_id: turnId,
    session_id: sessionState?.session_id || "default",
    user_id: userProfile?.user_id || "default",
    content_intent: "small_talk",
    stance: "listening",
    tone: "calm",
    emotion: {
      sad: 0.0,
      tired: 0.0,
      anxious: 0.0,
      angry: 0.0,
      lonely: 0.0,
      happy: 0.0,
      excited: 0.0
    },
    emotion_trend: "flat",
    cognitive_load: "mid",
    continue_or_close: "maintain",
    boundary_flag: "ok",
    stage_suggestion: "venting",
    confidence: 0.5,
    created_at: new Date().toISOString()
  };
}

/**
 * turn_id を生成
 */
function generateTurnId() {
  return 'turn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

