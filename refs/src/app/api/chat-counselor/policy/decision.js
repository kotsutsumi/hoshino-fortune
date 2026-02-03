/**
 * Step2: ポリシー決定（ルールベース）
 * turn_analysis を元に response_policy を生成する
 */

// =======================
// ヘルパー関数
// =======================

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// =======================
// 1. content_intent ごとのベースポリシー
// =======================

function basePolicyFromIntent(contentIntent, stance, currentStage) {
  // デフォルト値
  let max_sentences = 3;
  let min_sentences = 1;
  let include_question = false;
  let question_max = 0;
  let allow_advice = false;
  let allow_explaining = false;
  let allow_topic_shift = false;
  let target_tone = "neutral";
  let depth = "normal";
  let next_stage = currentStage;
  let should_summarize = false;

  switch (contentIntent) {
    case "emotion_share":
      max_sentences = 2;
      include_question = true;
      question_max = 1;
      allow_advice = false;
      allow_explaining = false;
      allow_topic_shift = false;
      target_tone = "calm";
      depth = "shallow";
      next_stage = "venting";
      break;

    case "emotion_positive":
      max_sentences = 3;
      include_question = true;
      question_max = 1;
      allow_advice = false;
      allow_explaining = false;
      allow_topic_shift = true;
      target_tone = "bright";
      depth = "normal";
      next_stage = currentStage;
      break;

    case "small_talk":
      max_sentences = 3;
      include_question = true;
      question_max = 1;
      allow_advice = false;
      allow_explaining = false;
      allow_topic_shift = true;
      target_tone = "bright";
      depth = "shallow";
      next_stage = currentStage;
      break;

    case "fact_share":
      max_sentences = 3;
      include_question = true;
      question_max = 1;
      allow_advice = false;
      allow_explaining = false;
      allow_topic_shift = false;
      target_tone = "neutral";
      depth = "normal";
      next_stage = "clarifying";
      break;

    case "light_question":
      max_sentences = 4;
      min_sentences = 2;
      include_question = false;
      question_max = 1;
      allow_advice = false;
      allow_explaining = true;
      allow_topic_shift = false;
      target_tone = "neutral";
      depth = "normal";
      next_stage = currentStage;
      break;

    case "deep_question":
      max_sentences = 5;
      min_sentences = 3;
      include_question = true;
      question_max = 1;
      allow_advice = false;
      allow_explaining = true;
      allow_topic_shift = false;
      target_tone = "serious";
      depth = "deep";
      next_stage = "exploration";
      break;

    case "task_request":
      max_sentences = 3;
      include_question = true;
      question_max = 1;
      allow_advice = false;
      allow_explaining = true;
      allow_topic_shift = false;
      target_tone = "neutral";
      depth = "normal";
      next_stage = currentStage;
      break;

    case "advice_request":
      max_sentences = 5;
      min_sentences = 3;
      include_question = true;
      question_max = 1;
      allow_advice = true;
      allow_explaining = true;
      allow_topic_shift = false;
      target_tone = "calm";
      depth = "deep";
      next_stage = "solution";
      break;

    case "complaint":
      max_sentences = 4;
      include_question = true;
      question_max = 1;
      allow_advice = false;
      allow_explaining = false;
      allow_topic_shift = false;
      target_tone = "calm";
      depth = "normal";
      next_stage = "venting";
      break;

    case "confession":
      max_sentences = 4;
      include_question = true;
      question_max = 1;
      allow_advice = false;
      allow_explaining = false;
      allow_topic_shift = false;
      target_tone = "soft";
      depth = "normal";
      next_stage = "venting";
      break;

    case "storytelling":
      max_sentences = 3;
      include_question = true;
      question_max = 1;
      allow_advice = false;
      allow_explaining = false;
      allow_topic_shift = true;
      target_tone = "neutral";
      depth = "normal";
      next_stage = currentStage;
      break;

    case "decision_need":
      max_sentences = 5;
      min_sentences = 3;
      include_question = true;
      question_max = 1;
      allow_advice = true;
      allow_explaining = true;
      allow_topic_shift = false;
      target_tone = "serious";
      depth = "deep";
      next_stage = "solution";
      break;

    case "meta_talk":
      max_sentences = 3;
      include_question = true;
      question_max = 1;
      allow_advice = false;
      allow_explaining = false;
      allow_topic_shift = false;
      target_tone = "calm";
      depth = "shallow";
      next_stage = currentStage;
      break;

    default:
      break;
  }

  // Stance で補正
  if (stance === "listening") {
    max_sentences = clamp(max_sentences - 1, 1, 10);
    depth = depth === "deep" ? "normal" : depth;
  }

  if (stance === "explaining") {
    max_sentences = clamp(max_sentences + 1, 1, 10);
    allow_explaining = true;
  }

  return {
    max_sentences,
    min_sentences,
    include_question,
    question_max,
    allow_advice,
    allow_explaining,
    allow_topic_shift,
    target_tone,
    depth,
    next_stage,
    should_summarize
  };
}

// =======================
// 2. cognitive_load 補正
// =======================

function applyCognitiveLoadAdjustments(policy, cognitiveLoad) {
  const p = { ...policy };

  if (cognitiveLoad === "high") {
    p.max_sentences = clamp(p.max_sentences - 1, 1, 10);
    p.min_sentences = clamp(p.min_sentences, 1, p.max_sentences);
    p.question_max = clamp(p.question_max, 0, 1);
    p.allow_advice = false;
    p.depth = p.depth === "deep" ? "normal" : p.depth;
  }

  if (cognitiveLoad === "low") {
    // 少し深めてもOK
    p.max_sentences = clamp(p.max_sentences + 1, 1, 10);
    if (p.depth === "normal") p.depth = "deep";
  }

  return p;
}

// =======================
// 3. stage 補正
// =======================

function applyStageAdjustments(policy, stage) {
  const p = { ...policy };

  switch (stage) {
    case "venting":
      p.allow_advice = false;
      p.allow_explaining = false;
      p.include_question = true;
      p.question_max = clamp(p.question_max, 0, 1);
      p.depth = p.depth === "deep" ? "normal" : p.depth;
      break;

    case "clarifying":
      p.allow_explaining = true;
      p.allow_advice = false;
      break;

    case "exploration":
      p.allow_explaining = true;
      // アドバイスは状況に応じて：ここでは既定のまま
      break;

    case "solution":
      p.allow_advice = true;
      p.allow_explaining = true;
      p.include_question = false; // 決めに行くフェーズ
      break;

    case "closure":
      p.max_sentences = clamp(p.max_sentences, 1, 3);
      p.include_question = false;
      p.should_summarize = p.should_summarize || false;
      break;
  }

  return p;
}

// =======================
// 4. user_profile 補正
// =======================

function applyUserProfileAdjustments(policy, userProfile) {
  const p = { ...policy };

  // 詳しさの好み
  switch (userProfile.detail_preference) {
    case "short":
      p.max_sentences = clamp(p.max_sentences - 1, 1, 10);
      break;
    case "deep":
      p.max_sentences = clamp(p.max_sentences + 1, 1, 10);
      if (p.depth === "shallow") p.depth = "normal";
      break;
    case "normal":
    default:
      break;
  }

  // アドバイスの好み
  switch (userProfile.style_preference.advice) {
    case "never":
      p.allow_advice = false;
      break;
    case "when_asked":
      // advice_request / decision_need など以外では false
      // ここではポリシー側に任せる
      break;
    case "proactive":
      // 既に true ならそのまま
      break;
  }

  // 質問の多さの好み
  if (userProfile.style_preference.questions === "low") {
    if (p.include_question) {
      p.question_max = clamp(p.question_max, 0, 1);
    }
  } else if (userProfile.style_preference.questions === "high") {
    if (p.include_question) {
      p.question_max = clamp(p.question_max + 1, 0, 3);
    }
  }

  // トーンの好み
  if (userProfile.tone_preference === "calm") {
    if (p.target_tone === "bright" || p.target_tone === "energetic") {
      p.target_tone = "calm";
    }
  } else if (userProfile.tone_preference === "bright") {
    if (p.target_tone === "serious" || p.target_tone === "calm") {
      p.target_tone = "bright";
    }
  }

  return p;
}

// =======================
// 5. relationship_level 補正
// =======================

function applyRelationshipAdjustments(policy, relationshipLevel) {
  const p = { ...policy };

  if (relationshipLevel === "new") {
    // 踏み込みすぎない・落ち着いたトーン
    if (p.target_tone === "bright" || p.target_tone === "energetic") {
      p.target_tone = "neutral";
    }
    p.allow_topic_shift = false;
  }

  if (relationshipLevel === "mid") {
    // ベース通りでOK
  }

  if (relationshipLevel === "close") {
    // ユーザーの好みに寄せてOK（特別な制限なし）
  }

  return p;
}

// =======================
// デフォルト値生成ヘルパー
// =======================

function createDefaultUserProfile(userId) {
  return {
    user_id: userId,
    relationship_level: "new",
    detail_preference: "normal",
    pace_preference: "normal",
    tone_preference: "calm",
    style_preference: {
      empathy: "mid",
      questions: "mid",
      advice: "when_asked"
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function createDefaultSessionState(sessionId, userId) {
  return {
    session_id: sessionId,
    user_id: userId,
    conversation_goal: "vent_emotion",
    stage: "venting",
    relationship_mood: "safe",
    default_tone_for_session: "calm",
    summary: "",
    last_turn_id: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// =======================
// メイン関数：ポリシー計算
// =======================

/**
 * 返答ポリシーを計算
 * @param {Object} userProfile - ユーザープロファイル
 * @param {Object} sessionState - セッション状態
 * @param {Object} turnAnalysis - Step1の解析結果
 * @returns {Object} response_policy
 */
export function computeResponsePolicy(userProfile, sessionState, turnAnalysis) {
  // 1. Intent からベースポリシー
  const base = basePolicyFromIntent(
    turnAnalysis.content_intent,
    turnAnalysis.stance,
    sessionState.stage
  );

  // ResponsePolicy に固定フィールドを追加
  let policy = {
    turn_id: turnAnalysis.turn_id,
    session_id: turnAnalysis.session_id,
    user_id: turnAnalysis.user_id,
    created_at: new Date().toISOString(),
    ...base
  };

  // 2. cognitive_load 補正
  policy = applyCognitiveLoadAdjustments(policy, turnAnalysis.cognitive_load);

  // 3. stage 補正
  const effectiveStage = sessionState.stage || turnAnalysis.stage_suggestion;
  policy = applyStageAdjustments(policy, effectiveStage);

  // 4. user_profile 補正
  policy = applyUserProfileAdjustments(policy, userProfile);

  // 5. relationship_level 補正
  policy = applyRelationshipAdjustments(policy, userProfile.relationship_level);

  // min/max の一貫性を最終調整
  policy.max_sentences = clamp(policy.max_sentences, 1, 10);
  policy.min_sentences = clamp(policy.min_sentences, 1, policy.max_sentences);
  policy.question_max = clamp(policy.question_max, 0, 5);

  return policy;
}

// 後方互換性のためのエイリアス
export function decideResponsePolicy(turnAnalysis, userProfile = null, sessionState = null) {
  // デフォルト値の設定
  if (!userProfile) {
    userProfile = createDefaultUserProfile(turnAnalysis.user_id || 'default');
  }
  if (!sessionState) {
    sessionState = createDefaultSessionState(
      turnAnalysis.session_id || 'default',
      turnAnalysis.user_id || 'default'
    );
  }
  
  return computeResponsePolicy(userProfile, sessionState, turnAnalysis);
}
