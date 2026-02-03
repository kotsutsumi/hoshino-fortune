import type { TenGod, FortuneCategory, ScoreLevel, CategoryFortune } from "./types";
import { CATEGORY_LABELS } from "./types";

// 十神ごとの総合運勢スコアとメッセージ
interface OverallFortuneData {
  score: ScoreLevel;
  message: string;
  luckyColor: string;
  luckyItem: string;
  luckyDirection: string;
}

const OVERALL_FORTUNE_DATA: Record<TenGod, OverallFortuneData> = {
  '比肩': {
    score: 3,
    message: '自分らしさを大切に。マイペースに過ごすと良い一日です。',
    luckyColor: 'グリーン',
    luckyItem: '手帳',
    luckyDirection: '東'
  },
  '劫財': {
    score: 3,
    message: '行動力が高まる日。新しいことに挑戦するチャンス！',
    luckyColor: 'オレンジ',
    luckyItem: 'スポーツウェア',
    luckyDirection: '南東'
  },
  '食神': {
    score: 5,
    message: '幸運の星が輝く最高の日！創造性を発揮して楽しんで。',
    luckyColor: 'ピンク',
    luckyItem: 'お気に入りの香水',
    luckyDirection: '南'
  },
  '傷官': {
    score: 4,
    message: '独創的なアイデアが浮かぶ日。自由な発想を大切に。',
    luckyColor: 'パープル',
    luckyItem: 'ノートとペン',
    luckyDirection: '南西'
  },
  '偏財': {
    score: 4,
    message: '人との出会いから幸運が生まれる日。社交的に過ごして。',
    luckyColor: 'ゴールド',
    luckyItem: '名刺入れ',
    luckyDirection: '西'
  },
  '正財': {
    score: 4,
    message: '堅実な努力が実を結ぶ日。コツコツと取り組むと吉。',
    luckyColor: 'ブラウン',
    luckyItem: '財布',
    luckyDirection: '北西'
  },
  '偏官': {
    score: 2,
    message: '責任が重くなる日。慎重に行動して、無理をしないで。',
    luckyColor: 'ネイビー',
    luckyItem: '腕時計',
    luckyDirection: '北'
  },
  '正官': {
    score: 3,
    message: '誠実さが評価される日。ルールを守り真摯に向き合って。',
    luckyColor: 'ホワイト',
    luckyItem: '清潔なハンカチ',
    luckyDirection: '北東'
  },
  '偏印': {
    score: 3,
    message: '直感が冴える不思議な日。スピリチュアルな体験があるかも。',
    luckyColor: 'シルバー',
    luckyItem: 'お守り',
    luckyDirection: '東北'
  },
  '印綬': {
    score: 4,
    message: '知識と学びの日。本を読んだり勉強すると運気アップ！',
    luckyColor: 'ブルー',
    luckyItem: '本',
    luckyDirection: '東南'
  }
};

// 十神×カテゴリごとの運勢データ
interface CategoryFortuneData {
  score: ScoreLevel;
  message: string;
  advice: string;
}

const CATEGORY_FORTUNE_DATA: Record<TenGod, Record<FortuneCategory, CategoryFortuneData>> = {
  '比肩': {
    love: {
      score: 3,
      message: '自分らしさを大切にする恋愛が吉。無理に合わせなくてOK。',
      advice: '相手にも自分の時間を大切にしてもらうと、関係が深まります。'
    },
    work: {
      score: 3,
      message: '独立した判断で進める仕事が向いている日。',
      advice: '自分のペースを守りながら、着実に進めましょう。'
    },
    relationships: {
      score: 3,
      message: '適度な距離感を保つと良好な関係が築けます。',
      advice: '一人の時間も大切に。無理な付き合いは避けて。'
    },
    money: {
      score: 3,
      message: '自己投資に良い日。スキルアップにお金を使うと吉。',
      advice: '自分磨きに投資することで、将来の収入アップに繋がります。'
    }
  },
  '劫財': {
    love: {
      score: 4,
      message: '積極的なアプローチが功を奏する日。思い切って声をかけて。',
      advice: '勢いだけでなく、相手の気持ちも大切に。'
    },
    work: {
      score: 4,
      message: '行動力が評価される日。新しいプロジェクトにも挑戦を。',
      advice: '慎重さも忘れずに。準備をしっかりしてから動いて。'
    },
    relationships: {
      score: 3,
      message: 'リーダーシップを発揮できる日。周囲を引っ張って。',
      advice: '強引になりすぎないよう注意。協調性も大切。'
    },
    money: {
      score: 2,
      message: '衝動買いに注意が必要な日。大きな出費は控えめに。',
      advice: '買い物は一晩考えてから決めると失敗が減ります。'
    }
  },
  '食神': {
    love: {
      score: 5,
      message: '恋愛運最高！魅力が輝き、素敵な出会いの予感。',
      advice: '自然体でいることが一番の魅力。笑顔を忘れずに。'
    },
    work: {
      score: 4,
      message: '創造的な仕事で才能が開花。アイデアがどんどん浮かぶ日。',
      advice: '思いついたアイデアはメモに残しておきましょう。'
    },
    relationships: {
      score: 5,
      message: '人気運アップ！周囲から好かれ、楽しい時間を過ごせます。',
      advice: '感謝の気持ちを言葉にすると、さらに運気アップ。'
    },
    money: {
      score: 4,
      message: '楽しいことにお金を使うと金運も上昇。趣味への投資が吉。',
      advice: '美味しいものを食べたり、趣味を楽しむことでエネルギーチャージ。'
    }
  },
  '傷官': {
    love: {
      score: 3,
      message: '個性的な魅力がアピールポイント。ユニークな自分を出して。',
      advice: '型にはまらない恋愛スタイルが合う日。自分らしく。'
    },
    work: {
      score: 5,
      message: '革新的なアイデアが評価される日。新しい提案をしてみて。',
      advice: '従来のやり方にとらわれず、新しい方法を試してみましょう。'
    },
    relationships: {
      score: 3,
      message: '本音で語り合える関係が深まる日。建前は置いておいて。',
      advice: '批判的になりすぎないよう注意。相手を傷つけないように。'
    },
    money: {
      score: 3,
      message: 'クリエイティブな方法で収入アップのチャンス。',
      advice: '副業やスキル販売など、新しい収入源を考えてみて。'
    }
  },
  '偏財': {
    love: {
      score: 4,
      message: '出会いの運気上昇。パーティーや飲み会に参加すると吉。',
      advice: '新しい出会いを求めて、積極的に外に出てみましょう。'
    },
    work: {
      score: 4,
      message: '営業や交渉事が好調。商談がまとまりやすい日。',
      advice: '人脈を活かした仕事が成功の鍵。積極的にコンタクトを。'
    },
    relationships: {
      score: 5,
      message: '社交運絶好調！新しい友人ができる予感。',
      advice: '名刺交換やSNSでの繋がりを大切に。'
    },
    money: {
      score: 4,
      message: '臨時収入や投資のチャンスあり。アンテナを張って。',
      advice: 'ただし、うまい話には注意。冷静な判断を心がけて。'
    }
  },
  '正財': {
    love: {
      score: 4,
      message: '真面目な交際が発展する日。誠実さが伝わります。',
      advice: '将来を見据えた関係構築を意識してみましょう。'
    },
    work: {
      score: 4,
      message: 'コツコツとした努力が評価される日。地道な作業が吉。',
      advice: '基本に忠実に。ミスなく丁寧に仕事を進めましょう。'
    },
    relationships: {
      score: 4,
      message: '信頼関係が深まる日。約束はきちんと守って。',
      advice: '小さな約束も大切に。信用を積み重ねていきましょう。'
    },
    money: {
      score: 5,
      message: '堅実な財運の日。貯蓄や長期投資に向いています。',
      advice: '地道な貯金が将来の大きな資産に。コツコツと。'
    }
  },
  '偏官': {
    love: {
      score: 2,
      message: '恋愛よりも仕事が気になる日。無理にデートしなくてOK。',
      advice: '今は自分の成長に集中する時期。焦らないで。'
    },
    work: {
      score: 3,
      message: '責任ある仕事を任される日。プレッシャーに負けないで。',
      advice: '困ったときは周囲に相談を。一人で抱え込まないで。'
    },
    relationships: {
      score: 2,
      message: '上下関係で緊張する場面がありそう。礼儀を大切に。',
      advice: '目上の人への敬意を忘れずに。謙虚な姿勢が大切。'
    },
    money: {
      score: 3,
      message: '大きな決断は避けた方が無難。様子を見て。',
      advice: '今日は守りの姿勢で。大きな投資は控えめに。'
    }
  },
  '正官': {
    love: {
      score: 3,
      message: '礼節ある交際が好印象。きちんとした態度が好感度アップ。',
      advice: 'TPOをわきまえた行動が、相手の心をつかみます。'
    },
    work: {
      score: 4,
      message: '真面目な姿勢が評価される日。ルールを守って行動を。',
      advice: '報告・連絡・相談を怠らずに。信頼を得られます。'
    },
    relationships: {
      score: 4,
      message: '誠実な人との縁が深まる日。良い人脈が広がります。',
      advice: '礼儀正しく接することで、尊敬される関係が築けます。'
    },
    money: {
      score: 3,
      message: '正当な方法での収入が吉。近道はしないで。',
      advice: '地道に働いた分だけの報酬を大切にしましょう。'
    }
  },
  '偏印': {
    love: {
      score: 3,
      message: '不思議な縁で出会う日。運命的な出会いがあるかも。',
      advice: '直感を信じて。ビビッときた相手には声をかけてみて。'
    },
    work: {
      score: 3,
      message: '直感が冴える日。ひらめきを大切に。',
      advice: '論理より感覚を信じてみると、良い結果につながります。'
    },
    relationships: {
      score: 3,
      message: 'スピリチュアルな話題で盛り上がれる日。',
      advice: '占いや精神世界に興味がある人と話すと楽しい時間に。'
    },
    money: {
      score: 2,
      message: '予想外の出費に注意。余裕を持った資金管理を。',
      advice: '急な出費に備えて、予備費を確保しておきましょう。'
    }
  },
  '印綬': {
    love: {
      score: 4,
      message: '知的な会話から恋が始まる日。話をじっくり聞いて。',
      advice: '相手の話に耳を傾けることで、心の距離が縮まります。'
    },
    work: {
      score: 5,
      message: '学習・研究に最適な日。スキルアップのチャンス！',
      advice: '資格取得や勉強会への参加が将来の飛躍につながります。'
    },
    relationships: {
      score: 4,
      message: '先輩や恩師との縁が深まる日。相談するなら今日。',
      advice: '目上の人からのアドバイスは素直に受け入れましょう。'
    },
    money: {
      score: 4,
      message: '教育や本への投資が吉。知識が将来の財産に。',
      advice: '資格取得費用や書籍代は惜しまず投資しましょう。'
    }
  }
};

/**
 * 十神から総合運勢データを取得
 */
export function getOverallFortune(tenGod: TenGod): OverallFortuneData {
  return OVERALL_FORTUNE_DATA[tenGod];
}

/**
 * 十神とカテゴリから運勢データを取得
 */
export function getCategoryFortune(tenGod: TenGod, category: FortuneCategory): CategoryFortune {
  const data = CATEGORY_FORTUNE_DATA[tenGod][category];
  return {
    category,
    label: CATEGORY_LABELS[category],
    score: data.score,
    message: data.message,
    advice: data.advice
  };
}

/**
 * 十神から全カテゴリの運勢データを取得
 */
export function getAllCategoryFortunes(tenGod: TenGod): CategoryFortune[] {
  const categories: FortuneCategory[] = ['love', 'work', 'relationships', 'money'];
  return categories.map(cat => getCategoryFortune(tenGod, cat));
}
