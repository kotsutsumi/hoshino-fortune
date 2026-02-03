import type { EmotionCategory, IntentType, MessageAnalysis } from "./types";

// 感情を示すキーワードパターン
const EMOTION_PATTERNS: Record<EmotionCategory, RegExp[]> = {
  positive: [
    /嬉し/,
    /楽し/,
    /幸せ/,
    /ありがと/,
    /良かった/,
    /素敵/,
    /最高/,
    /ワクワク/,
    /ドキドキ/,
    /好き/,
  ],
  negative: [
    /辛い/,
    /悲し/,
    /苦し/,
    /嫌/,
    /最悪/,
    /ダメ/,
    /失敗/,
    /うまくいか/,
    /落ち込/,
    /イライラ/,
  ],
  anxious: [
    /不安/,
    /心配/,
    /怖い/,
    /どうしよう/,
    /わからな/,
    /迷/,
    /困/,
    /悩/,
    /モヤモヤ/,
    /自信が/,
  ],
  neutral: [],
};

// 意図を示すキーワードパターン
const INTENT_PATTERNS: Record<IntentType, RegExp[]> = {
  consultation: [
    /どうしたら/,
    /アドバイス/,
    /教えて/,
    /相談/,
    /助けて/,
    /どうすれば/,
    /した方がいい/,
  ],
  venting: [
    /聞いて/,
    /話したい/,
    /言わせて/,
    /ムカつく/,
    /疲れた/,
    /もう/,
    /いい加減/,
  ],
  question: [
    /？/,
    /\?/,
    /なに/,
    /何/,
    /どう/,
    /いつ/,
    /どこ/,
    /誰/,
    /なぜ/,
    /どれ/,
  ],
  greeting: [
    /こんにちは/,
    /おはよう/,
    /こんばんは/,
    /初めまして/,
    /よろしく/,
    /久しぶり/,
    /元気/,
  ],
  gratitude: [
    /ありがとう/,
    /感謝/,
    /助かった/,
    /おかげ/,
    /嬉しい/,
    /救われた/,
  ],
};

// トピックキーワード
const TOPIC_KEYWORDS: Record<string, RegExp[]> = {
  '恋愛': [/恋/, /彼氏/, /彼女/, /好きな人/, /デート/, /告白/, /結婚/, /婚活/, /片思い/, /復縁/],
  '仕事': [/仕事/, /職場/, /上司/, /同僚/, /転職/, /キャリア/, /給料/, /残業/, /会社/, /プロジェクト/],
  '人間関係': [/友達/, /友人/, /家族/, /親/, /兄弟/, /姉妹/, /人間関係/, /コミュニケーション/, /距離感/],
  'お金': [/お金/, /貯金/, /節約/, /投資/, /収入/, /支出/, /借金/, /ローン/],
  '健康': [/健康/, /体調/, /病気/, /ストレス/, /睡眠/, /食事/, /運動/, /ダイエット/],
  '将来': [/将来/, /未来/, /夢/, /目標/, /やりたいこと/, /進路/, /人生/],
};

/**
 * メッセージの感情を分析
 */
function analyzeEmotion(message: string): EmotionCategory {
  const scores: Record<EmotionCategory, number> = {
    positive: 0,
    negative: 0,
    anxious: 0,
    neutral: 0,
  };

  for (const [emotion, patterns] of Object.entries(EMOTION_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(message)) {
        scores[emotion as EmotionCategory]++;
      }
    }
  }

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'neutral';

  return (Object.entries(scores).find(([, score]) => score === maxScore)?.[0] || 'neutral') as EmotionCategory;
}

/**
 * メッセージの意図を分析
 */
function analyzeIntent(message: string): IntentType {
  const scores: Record<IntentType, number> = {
    consultation: 0,
    venting: 0,
    question: 0,
    greeting: 0,
    gratitude: 0,
  };

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(message)) {
        scores[intent as IntentType]++;
      }
    }
  }

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'consultation';

  return (Object.entries(scores).find(([, score]) => score === maxScore)?.[0] || 'consultation') as IntentType;
}

/**
 * メッセージからキーワードを抽出
 */
function extractKeywords(message: string): string[] {
  const keywords: string[] = [];

  for (const [, patterns] of Object.entries(TOPIC_KEYWORDS)) {
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        keywords.push(match[0]);
      }
    }
  }

  return [...new Set(keywords)].slice(0, 5);
}

/**
 * メッセージのトピックを特定
 */
function identifyTopic(message: string): string {
  const scores: Record<string, number> = {};

  for (const [topic, patterns] of Object.entries(TOPIC_KEYWORDS)) {
    scores[topic] = 0;
    for (const pattern of patterns) {
      if (pattern.test(message)) {
        scores[topic]++;
      }
    }
  }

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return '日常';

  return Object.entries(scores).find(([, score]) => score === maxScore)?.[0] || '日常';
}

/**
 * メッセージを総合的に分析
 */
export function analyzeMessage(message: string): MessageAnalysis {
  return {
    emotion: analyzeEmotion(message),
    intent: analyzeIntent(message),
    keywords: extractKeywords(message),
    topic: identifyTopic(message),
  };
}
