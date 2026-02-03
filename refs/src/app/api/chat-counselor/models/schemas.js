/**
 * AI会話エージェント：データ構造定義
 * バージョン: v1.0
 */

// ============================================
// 1. user_profile（長期）
// ============================================
export const UserProfileSchema = {
  user_id: "string",
  relationship_level: "new",        // "new" | "mid" | "close"
  detail_preference: "normal",      // "short" | "normal" | "deep"
  pace_preference: "normal",        // "slow" | "normal" | "fast"
  tone_preference: "calm",          // "calm" | "neutral" | "bright"
  style_preference: {
    empathy: "mid",                 // "low" | "mid" | "high"
    questions: "mid",               // "low" | "mid" | "high"
    advice: "when_asked"            // "never" | "when_asked" | "proactive"
  },
  created_at: null,
  updated_at: null
};

// ============================================
// 2. session_state（中期）
// ============================================
export const SessionStateSchema = {
  session_id: "string",
  user_id: "string",
  conversation_goal: "vent_emotion", 
  // "small_talk" | "vent_emotion" | "life_consult" | "work_consult" | 
  // "decision_support" | "creative_support" | "task_execution"
  stage: "venting",                 
  // "venting" | "clarifying" | "exploration" | "solution" | "closure"
  relationship_mood: "safe",        // "safe" | "awkward" | "tense" | "light"
  default_tone_for_session: "calm", // "calm" | "neutral" | "bright"
  summary: "",
  last_turn_id: "",
  created_at: null,
  updated_at: null
};

// ============================================
// 3. turn_analysis（Step1の出力）
// ============================================
export const TurnAnalysisSchema = {
  turn_id: "string",
  session_id: "string",
  user_id: "string",

  // 内容タイプ
  content_intent: "emotion_share",  
  // "emotion_share" | "emotion_positive" | "small_talk" | "fact_share" |
  // "light_question" | "deep_question" | "task_request" | "advice_request" |
  // "complaint" | "confession" | "storytelling" | "decision_need" | "meta_talk"

  // スタンス
  stance: "listening",            
  // "listening" | "questioning" | "co_thinking" | "advising" |
  // "explaining" | "chatting" | "cheering" | "soothing" | "boundary"

  // トーン
  tone: "calm",                     
  // "calm" | "soft" | "neutral" | "bright" | "energetic" | "serious" | "gentle"

  // 感情スコア（0.0〜1.0）
  emotion: {
    sad: 0.0,
    tired: 0.0,
    anxious: 0.0,
    angry: 0.0,
    lonely: 0.0,
    happy: 0.0,
    excited: 0.0
  },

  // 感情トレンド
  emotion_trend: "flat",            // "up" | "down" | "flat"
  
  // 認知負荷
  cognitive_load: "mid",            // "high" | "mid" | "low"
  
  // 会話継続意図
  continue_or_close: "maintain",    // "deepen" | "maintain" | "close"

  // 境界フラグ
  boundary_flag: "ok",              // "ok" | "careful" | "avoid"
  
  // ステージ推奨
  stage_suggestion: "venting",      
  // "venting" | "clarifying" | "exploration" | "solution" | "closure"

  // 信頼度
  confidence: 0.0,
  
  created_at: null
};

// ============================================
// 4. response_policy（Step2の出力）
// ============================================
export const ResponsePolicySchema = {
  turn_id: "string",
  session_id: "string",
  user_id: "string",

  // 文量制御
  max_sentences: 3,
  min_sentences: 1,

  // 質問制御
  include_question: false,
  question_max: 0,

  // 内容制御
  allow_advice: false,
  allow_explaining: false,
  allow_topic_shift: false,

  // トーン・深度
  target_tone: "neutral",           // "calm" | "soft" | "neutral" | "bright" | "energetic" | "serious" | "gentle"
  depth: "normal",                  // "shallow" | "normal" | "deep"

  // フェーズ管理
  next_stage: "venting",            // "venting" | "clarifying" | "exploration" | "solution" | "closure"
  should_summarize: false,

  created_at: null
};

// ============================================
// ヘルパー関数
// ============================================

/**
 * デフォルトのUserProfileを生成
 */
export function createDefaultUserProfile(userId) {
  return {
    ...UserProfileSchema,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * デフォルトのSessionStateを生成
 */
export function createDefaultSessionState(sessionId, userId) {
  return {
    ...SessionStateSchema,
    session_id: sessionId,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * TurnAnalysisのバリデーション
 */
export function validateTurnAnalysis(analysis) {
  // 必須フィールドのチェック
  const required = ['turn_id', 'content_intent', 'stance', 'tone'];
  for (const field of required) {
    if (!analysis[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  return true;
}

/**
 * ResponsePolicyのバリデーション
 */
export function validateResponsePolicy(policy) {
  // 文量チェック
  if (policy.min_sentences > policy.max_sentences) {
    throw new Error('min_sentences cannot be greater than max_sentences');
  }
  
  // 質問数チェック
  if (policy.include_question && policy.question_max < 1) {
    throw new Error('question_max must be at least 1 when include_question is true');
  }
  
  return true;
}

