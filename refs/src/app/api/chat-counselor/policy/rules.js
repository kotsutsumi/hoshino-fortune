/**
 * ポリシー決定用のルール定義
 * 将来的に外部から設定変更できるようにする想定
 */

/**
 * content_intent ごとのデフォルトポリシー
 */
export const CONTENT_INTENT_RULES = {
  emotion_share: {
    max_sentences: 2,
    min_sentences: 1,
    include_question: true,
    question_max: 1,
    allow_advice: false,
    depth: "shallow"
  },
  question: {
    max_sentences: 3,
    allow_advice: true,
    allow_explaining: true,
    depth: "medium"
  },
  problem: {
    max_sentences: 3,
    include_question: true,
    allow_advice: true,
    depth: "medium"
  },
  casual: {
    max_sentences: 2,
    min_sentences: 1,
    include_question: true,
    depth: "shallow"
  },
  gratitude: {
    max_sentences: 1,
    include_question: false,
    depth: "shallow"
  },
  complaint: {
    max_sentences: 2,
    include_question: true,
    question_max: 1,
    allow_advice: false,
    depth: "shallow"
  }
};

/**
 * stage ごとのデフォルトポリシー
 */
export const STAGE_RULES = {
  opening: {
    include_question: true,
    allow_advice: false,
    depth: "shallow"
  },
  venting: {
    allow_advice: false,
    depth: "shallow"
  },
  organizing: {
    include_question: true,
    question_max: 1,
    allow_advice: false,
    depth: "medium"
  },
  exploring: {
    allow_advice: true,
    depth: "medium"
  },
  resolving: {
    allow_advice: true,
    allow_explaining: true,
    depth: "deep"
  },
  closing: {
    max_sentences: 2,
    include_question: false,
    should_summarize: true
  }
};

/**
 * cognitive_load ごとの調整ルール
 */
export const COGNITIVE_LOAD_RULES = {
  high: {
    max_sentences_adjustment: -1,  // 最大文数を減らす
    min_sentences: 1,
    question_max: 1,
    allow_explaining: false
  },
  normal: {
    // 調整なし
  },
  low: {
    max_sentences_adjustment: 1   // 最大文数を増やす
  }
};

/**
 * マツコAI専用ルール
 */
export const MATSUKO_RULES = {
  // 毒舌使用の判定基準
  sarcasm_conditions: {
    needs_sarcasm: true,
    ready_for_truth: true,
    vulnerability_level: ["low", "normal"]  // high は除外
  },
  
  // 傷つきやすさ対応
  vulnerability_adjustments: {
    high: {
      use_sarcasm: false,
      directness: "gentle",
      empathy_mode: "full"
    },
    normal: {
      directness: "moderate"
    },
    low: {
      directness: "sharp"
    }
  },
  
  // 本音受容度対応
  truth_readiness_adjustments: {
    true: {
      // 本音OK → 毒舌可能
    },
    false: {
      use_sarcasm: false,
      directness: "gentle"
    }
  }
};

/**
 * ユーザープロファイル調整ルール
 */
export const USER_PREFERENCE_ADJUSTMENTS = {
  detail_preference: {
    short: { max_sentences_adjustment: -1 },
    normal: {},
    deep: { max_sentences_adjustment: 1 }
  },
  
  style_preference: {
    questions: {
      low: { include_question: false },
      mid: {},
      high: { question_max: 2 }
    },
    advice: {
      never: { allow_advice: false },
      when_asked: {},
      proactive: { allow_advice: true }
    }
  },
  
  matsuko_style: {
    sarcasm_level: {
      low: { use_sarcasm: false },
      mid: {},
      high: { use_sarcasm: true }
    }
  }
};

