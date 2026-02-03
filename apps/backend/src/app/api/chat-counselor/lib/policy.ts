import type { MessageAnalysis, ResponsePolicy } from "./types";

/**
 * 分析結果から応答ポリシーを決定
 */
export function determinePolicy(analysis: MessageAnalysis): ResponsePolicy {
  const { emotion, intent } = analysis;

  // 基本ポリシー
  let tone: ResponsePolicy['tone'] = 'direct';
  let responseLength: ResponsePolicy['responseLength'] = 'medium';
  let includeAdvice = true;
  let includeEncouragement = true;

  // 感情に基づくトーン調整
  switch (emotion) {
    case 'negative':
      tone = 'empathetic';
      includeEncouragement = true;
      responseLength = 'long';
      break;
    case 'anxious':
      tone = 'supportive';
      includeEncouragement = true;
      responseLength = 'medium';
      break;
    case 'positive':
      tone = 'playful';
      includeEncouragement = false;
      responseLength = 'medium';
      break;
    case 'neutral':
      tone = 'direct';
      break;
  }

  // 意図に基づく調整
  switch (intent) {
    case 'consultation':
      includeAdvice = true;
      responseLength = 'long';
      break;
    case 'venting':
      includeAdvice = false;
      tone = 'empathetic';
      responseLength = 'medium';
      break;
    case 'question':
      includeAdvice = true;
      responseLength = 'medium';
      break;
    case 'greeting':
      tone = 'playful';
      includeAdvice = false;
      includeEncouragement = false;
      responseLength = 'short';
      break;
    case 'gratitude':
      tone = 'playful';
      includeAdvice = false;
      responseLength = 'short';
      break;
  }

  return {
    tone,
    responseLength,
    includeAdvice,
    includeEncouragement,
  };
}
