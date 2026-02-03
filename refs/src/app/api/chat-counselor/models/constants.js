/**
 * AI会話エージェント：定数定義
 */

// ============================================
// content_intent（内容意図）
// ============================================
export const CONTENT_INTENT = {
  EMOTION_SHARE: 'emotion_share',         // 「疲れた」「しんどい」など感情吐露
  EMOTION_POSITIVE: 'emotion_positive',   // 「嬉しかった」など前向き感情
  SMALL_TALK: 'small_talk',               // 天気・日常ネタなど雑談
  FACT_SHARE: 'fact_share',               // 事実や状況の共有
  LIGHT_QUESTION: 'light_question',       // 軽い質問
  DEEP_QUESTION: 'deep_question',         // 生き方・価値観など抽象的質問
  TASK_REQUEST: 'task_request',           // 作業依頼（まとめて・整理して）
  ADVICE_REQUEST: 'advice_request',       // 助言を求める
  COMPLAINT: 'complaint',                 // 不満・怒りの表明
  CONFESSION: 'confession',               // 打ち明け話
  STORYTELLING: 'storytelling',           // 出来事を詳しく語る
  DECISION_NEED: 'decision_need',         // 意思決定の相談
  META_TALK: 'meta_talk'                  // 会話そのものの宣言
};

// ============================================
// stance（スタンス）
// ============================================
export const STANCE = {
  LISTENING: 'listening',             // ひたすら受け止める
  QUESTIONING: 'questioning',         // 短い質問をする
  CO_THINKING: 'co_thinking',         // いっしょに整理・思考
  ADVISING: 'advising',               // 助言する
  EXPLAINING: 'explaining',           // 知識や仕組みを説明
  CHATTING: 'chatting',               // 軽い雑談として返す
  CHEERING: 'cheering',               // 励ます・応援する
  SOOTHING: 'soothing',               // 落ち着かせる・安心させる
  BOUNDARY: 'boundary'                // あまり踏み込まない
};

// ============================================
// tone（トーン）
// ============================================
export const TONE = {
  CALM: 'calm',                       // 落ち着いた静かなトーン
  SOFT: 'soft',                       // 優しく柔らかいトーン
  NEUTRAL: 'neutral',                 // 標準的でフラット
  BRIGHT: 'bright',                   // 少し明るめでポジティブ
  ENERGETIC: 'energetic',             // 元気でテンション高め
  SERIOUS: 'serious',                 // 真面目で慎重
  GENTLE: 'gentle'                    // ふんわりした優しさ
};

// ============================================
// emotion_trend（感情トレンド）
// ============================================
export const EMOTION_TREND = {
  UP: 'up',                           // ネガティブ感情が強くなった
  DOWN: 'down',                       // ネガティブ感情が弱くなった
  FLAT: 'flat'                        // あまり変化していない
};

// ============================================
// cognitive_load（認知負荷）
// ============================================
export const COGNITIVE_LOAD = {
  HIGH: 'high',                       // かなり疲れている・混乱・余裕なし
  MID: 'mid',                         // 普通の会話ができている
  LOW: 'low'                          // 元気で余裕あり
};

// ============================================
// continue_or_close（会話継続意図）
// ============================================
export const CONTINUE_OR_CLOSE = {
  DEEPEN: 'deepen',                   // もう少し深く聞いた方が良い
  MAINTAIN: 'maintain',               // 今の深さで様子見
  CLOSE: 'close'                      // 話を締める・次の話題へ
};

// ============================================
// boundary_flag（境界フラグ）
// ============================================
export const BOUNDARY_FLAG = {
  OK: 'ok',                           // 通常の深さで踏み込んで良い
  CAREFUL: 'careful',                 // 少し慎重に踏み込むべき
  AVOID: 'avoid'                      // 踏み込み質問や強いアドバイスは避ける
};

// ============================================
// stage（会話ステージ）
// ============================================
export const STAGE = {
  VENTING: 'venting',                 // まだ吐き出したい・聞いてほしい
  CLARIFYING: 'clarifying',           // 何が起きているか整理したい
  EXPLORATION: 'exploration',         // 選択肢を探っている
  SOLUTION: 'solution',               // 具体的な行動を決めたい
  CLOSURE: 'closure'                  // 話を一区切りつけたい
};

// ============================================
// conversation_goal（会話目的）
// ============================================
export const CONVERSATION_GOAL = {
  SMALL_TALK: 'small_talk',           // 雑談
  VENT_EMOTION: 'vent_emotion',       // 感情の吐き出し
  LIFE_CONSULT: 'life_consult',       // 人生相談
  WORK_CONSULT: 'work_consult',       // 仕事相談
  DECISION_SUPPORT: 'decision_support', // 意思決定支援
  CREATIVE_SUPPORT: 'creative_support', // 創造的支援
  TASK_EXECUTION: 'task_execution'    // タスク実行
};

// ============================================
// relationship_level（関係性レベル）
// ============================================
export const RELATIONSHIP_LEVEL = {
  NEW: 'new',
  MID: 'mid',
  CLOSE: 'close'
};

// ============================================
// preference（好みレベル）
// ============================================
export const PREFERENCE_LEVEL = {
  LOW: 'low',
  MID: 'mid',
  HIGH: 'high'
};

export const PREFERENCE_DETAIL = {
  SHORT: 'short',
  NORMAL: 'normal',
  DEEP: 'deep'
};

export const PREFERENCE_PACE = {
  SLOW: 'slow',
  NORMAL: 'normal',
  FAST: 'fast'
};

export const PREFERENCE_TONE = {
  CALM: 'calm',
  NEUTRAL: 'neutral',
  BRIGHT: 'bright'
};

export const PREFERENCE_ADVICE = {
  NEVER: 'never',
  WHEN_ASKED: 'when_asked',
  PROACTIVE: 'proactive'
};

// ============================================
// マツコAI専用定数
// ============================================
export const MATSUKO_SARCASM_LEVEL = {
  LOW: 'low',
  MID: 'mid',
  HIGH: 'high'
};

export const MATSUKO_EMPATHY_TIMING = {
  CONSISTENT: 'consistent',           // 一貫して共感
  GAP: 'gap',                         // ギャップ型（毒舌→共感）
  RARE: 'rare'                        // まれに共感
};

export const MATSUKO_STRAIGHTNESS = {
  GENTLE: 'gentle',
  MODERATE: 'moderate',
  DIRECT: 'direct'
};

// ============================================
// response_policy 用定数
// ============================================
export const TARGET_TONE = {
  CALM: 'calm',
  NEUTRAL: 'neutral',
  BRIGHT: 'bright',
  SARCASTIC: 'sarcastic',
  WARM: 'warm'
};

export const DEPTH = {
  SHALLOW: 'shallow',
  MEDIUM: 'medium',
  DEEP: 'deep'
};

export const DIRECTNESS = {
  GENTLE: 'gentle',
  MODERATE: 'moderate',
  SHARP: 'sharp'
};

// ============================================
// デフォルト値
// ============================================
export const DEFAULTS = {
  MAX_SENTENCES: 2,
  MIN_SENTENCES: 1,
  QUESTION_MAX: 1,
  CONFIDENCE_THRESHOLD: 0.7
};

