/**
 * Step3: 返答生成LLM
 * response_policy に基づいて実際の返答文を生成する
 */

import OpenAI from 'openai';
import { getGenerationSystemPrompt } from './prompts.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 返答を生成
 * @param {Object} responsePolicy - Step2の出力
 * @param {Object} turnAnalysis - Step1の出力（任意）
 * @param {string} userMessage - ユーザーの発話
 * @param {Array} conversationHistory - 会話履歴
 * @param {Object} userProfile - ユーザープロファイル（任意）
 * @returns {Promise<Object>} 生成された返答
 */
export async function generateResponse(
  responsePolicy, 
  turnAnalysis = null, 
  userMessage = "", 
  conversationHistory = [],
  userProfile = null
) {
  try {
    // プロンプトを構築
    const systemPrompt = getGenerationSystemPrompt(responsePolicy);

    // OpenAI APIを呼び出し
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...buildUserProfileMessage(userProfile),
        ...buildConversationMessages(conversationHistory),
        { role: "user", content: userMessage }
      ],
      temperature: 0.8,       // 創造的に
      max_tokens: 800,
      presence_penalty: 0.6,  // 同じ表現の繰り返しを避ける
      frequency_penalty: 0.3  // より多様な表現を促進
    });

    const responseText = completion.choices[0].message.content;

    return {
      success: true,
      response: responseText,
      metadata: {
        tokensUsed: completion.usage?.total_tokens || 0,
        model: "gpt-4o",
        policy: responsePolicy
      }
    };

  } catch (error) {
    console.error('Response Generation Error:', error);
    return {
      success: false,
      error: error.message,
      fallback: generateFallbackResponse(userMessage)
    };
  }
}

/**
 * ユーザープロファイル情報をメッセージ形式に変換
 */
function buildUserProfileMessage(userProfile) {
  if (!userProfile || Object.keys(userProfile).length === 0) {
    return [];
  }

  let profileInfo = '【ユーザー情報】\n';
  if (userProfile.name) profileInfo += `お名前: ${userProfile.name}\n`;
  if (userProfile.age) profileInfo += `年代: ${userProfile.age}\n`;
  if (userProfile.situation) profileInfo += `状況: ${userProfile.situation}\n`;
  if (userProfile.interests) profileInfo += `関心事: ${userProfile.interests}\n`;

  return [{ role: "system", content: profileInfo }];
}

/**
 * 会話履歴をメッセージ形式に変換
 */
function buildConversationMessages(conversationHistory) {
  if (!conversationHistory || conversationHistory.length === 0) {
    return [];
  }

  // 最新10件まで
  return conversationHistory.slice(-10)
    .filter(msg => msg.role === 'user' || msg.role === 'assistant')
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }));
}

/**
 * フォールバック応答
 */
function generateFallbackResponse(userMessage) {
  const responses = [
    "そうね",
    "ふーん",
    "で？",
    "それで？",
    "あっそう",
    "ちょっと今忙しくてね",
    "まぁ、そういうのあるわよね"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
