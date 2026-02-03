// 天干による4ジャンル運勢データ（十神ベース）
const HEAVENLY_STEM_FORTUNE_DATA = {
  '甲': {
    keywords: ['成長', 'リーダー', '開拓', '積極', '創造'],
    genres: {
      love: { score: 85, keyword: '積極的に愛をリードしよう', description: 'リーダーシップを発揮して関係をリードする日。積極的なアプローチが功を奏する。' },
      work: { score: 90, keyword: '新しい道を切り開こう', description: '新しいプロジェクトや企画を立ち上げるのに最適。開拓精神で道を切り開こう。' },
      relationship: { score: 82, keyword: 'みんなを引っ張っていこう', description: 'グループの中心となって活動する日。周りを引っ張る役割を果たそう。' },
      money: { score: 78, keyword: '成長への投資を始めよう', description: '投資や新事業への資金投入を検討するのに良い日。成長性を重視して。' }
    }
  },
  '乙': {
    keywords: ['柔軟', '協調', '美', '成長', '調和'],
    genres: {
      love: { score: 88, keyword: '美しい愛を育もう', description: '優しさと柔軟性で相手の心を掴む日。美しいものを一緒に楽しむデートが◎。' },
      work: { score: 80, keyword: 'チームワークを大切に', description: '協調性を活かしてチームワークを高める日。美的センスが評価される。' },
      relationship: { score: 92, keyword: '調和の架け橋になろう', description: '人間関係の調整役として力を発揮。争いを和らげる役割を果たす。' },
      money: { score: 75, keyword: '価値あるものを見極めよう', description: '美しいものや芸術品への投資を検討する日。価値あるものを見極めて。' }
    }
  },
  '丙': {
    keywords: ['明朗', '積極', '創造', '情熱', '表現'],
    genres: {
      love: { score: 92, keyword: '燃えるような愛を表現しよう', description: '明るく情熱的な魅力で相手を惹きつける日。率直に気持ちを表現しよう。' },
      work: { score: 88, keyword: '創造力で勝負しよう', description: '創造性とアイデアが評価される日。プレゼンや企画提案に最適。' },
      relationship: { score: 90, keyword: '明るいエネルギーで輝こう', description: '明るいエネルギーで周りを元気にする日。パーティーや集まりで輝く。' },
      money: { score: 82, keyword: '楽しみながら稼ごう', description: 'エンターテイメントや創作活動への投資が吉。楽しみながら稼ぐ方法を。' }
    }
  },
  '丁': {
    keywords: ['温和', '思いやり', '芸術', '繊細', '癒し'],
    genres: {
      love: { score: 90, keyword: '優しい愛で心を癒やそう', description: '温かい思いやりで相手を包む日。繊細な心遣いが愛を深める。' },
      work: { score: 85, keyword: '人をサポートして輝こう', description: '芸術的な仕事や人をサポートする業務に向いている日。' },
      relationship: { score: 88, keyword: '優しさで心を動かそう', description: '困っている人を助ける日。優しさが多くの人の心を動かす。' },
      money: { score: 80, keyword: '堅実に歩んでいこう', description: '安定した収入源を大切にする日。無駄遣いを避けて堅実に。' }
    }
  },
  '戊': {
    keywords: ['安定', '責任', '包容', '基盤', '信頼'],
    genres: {
      love: { score: 82, keyword: '安定した愛を築こう', description: '包容力と安定感で相手に安心感を与える日。長期的な関係を築こう。' },
      work: { score: 90, keyword: '基盤をしっかり作ろう', description: '責任ある立場で力を発揮する日。基盤作りや管理業務に最適。' },
      relationship: { score: 85, keyword: '信頼を深めていこう', description: '信頼関係を深める日。約束を守り、責任を果たすことが大切。' },
      money: { score: 88, keyword: '長期的な資産を築こう', description: '不動産や長期投資について検討する日。安定性を重視した資産形成を。' }
    }
  },
  '己': {
    keywords: ['忍耐', '育成', '現実', '堅実', '継続'],
    genres: {
      love: { score: 78, keyword: '愛を育てて支えよう', description: '忍耐強く相手を支える日。現実的な将来設計を話し合うのに良い。' },
      work: { score: 85, keyword: '人を育てて成長しよう', description: '地道な努力が実を結ぶ日。人材育成や長期プロジェクトに取り組もう。' },
      relationship: { score: 80, keyword: '育成の喜びを感じよう', description: '後輩や部下の面倒を見る日。育成能力が評価される。' },
      money: { score: 85, keyword: 'コツコツと積み重ねよう', description: '堅実な貯蓄や資産管理に向いている日。コツコツと積み重ねよう。' }
    }
  },
  '庚': {
    keywords: ['意志', '正義', '行動', '決断', '突破'],
    genres: {
      love: { score: 75, keyword: '強い意志で愛を貫こう', description: '強い意志で関係を進展させる日。はっきりとした態度で臨もう。' },
      work: { score: 88, keyword: '困難を突破していこう', description: '困難な問題を解決する日。正義感と行動力で道を切り開く。' },
      relationship: { score: 78, keyword: '正しいことを伝えよう', description: '正しいことを主張する日。時には厳しさも必要。' },
      money: { score: 82, keyword: '大胆に判断していこう', description: '大胆な投資判断が求められる日。リスクを取る勇気も大切。' }
    }
  },
  '辛': {
    keywords: ['繊細', '美意識', '完璧', '洗練', '品格'],
    genres: {
      love: { score: 88, keyword: '洗練された愛を求めて', description: '洗練された魅力で相手を惹きつける日。品のある振る舞いを心がけて。' },
      work: { score: 85, keyword: '完璧を目指して取り組もう', description: '細部にこだわる仕事で力を発揮する日。完璧主義が良い結果を生む。' },
      relationship: { score: 82, keyword: '上品な交流を楽しもう', description: '上品で洗練された交流ができる日。質の高い人間関係を築こう。' },
      money: { score: 80, keyword: '価値あるものに投資しよう', description: '高品質なものへの投資を検討する日。価値のあるものを見極めて。' }
    }
  },
  '壬': {
    keywords: ['流動', '適応', '知恵', '変化', '包容'],
    genres: {
      love: { score: 85, keyword: '流れに身を任せた出会いを', description: '流れに身を任せて自然な出会いを楽しむ日。適応力が魅力となる。' },
      work: { score: 88, keyword: '柔軟に対応していこう', description: '変化に柔軟に対応する日。知恵と経験を活かして問題解決を。' },
      relationship: { score: 90, keyword: '多様な交流を広げよう', description: '多様な人との交流を楽しむ日。包容力で多くの人を受け入れよう。' },
      money: { score: 85, keyword: '流動的な投資を考えよう', description: '流動性の高い投資や多角的な収入源を検討する日。' }
    }
  },
  '癸': {
    keywords: ['直感', '神秘', '浄化', '感性', '洞察'],
    genres: {
      love: { score: 82, keyword: '直感で運命の愛を見つけて', description: '直感を信じて行動する日。神秘的な魅力で相手を惹きつける。' },
      work: { score: 80, keyword: '洞察力で創作しよう', description: '直感力と洞察力が冴える日。創作活動や研究に向いている。' },
      relationship: { score: 85, keyword: '心を読み取って絆を深めよう', description: '相手の心を読み取る力が高まる日。深い理解で絆を深めよう。' },
      money: { score: 78, keyword: '直感と情報を両方大切に', description: '直感的な投資判断も良いが、情報収集も怠らないように。' }
    }
  }
};

// 干支の組み合わせによる日の運勢のモックデータ（4ジャンル対応）
const dayFortuneData = {
  combinations: {
    // 子年の人の各干支日
    "子": {
      "子": { 
        type: "大吉日", 
        keywords: ["直感", "新始動", "創造", "機敏", "洞察"],
        genres: {
          love: { score: 95, description: "直感を信じて行動すると良い出会いがある。既存の関係も新たな展開が期待できる。" },
          work: { score: 90, description: "新しいプロジェクトを始めるのに最適。アイデアが次々と浮かび、創造的な仕事ができる。" },
          relationship: { score: 88, description: "コミュニケーション能力が高まり、人との繋がりが深まる。新しい友人もできそう。" },
          money: { score: 85, description: "投資や新しい収入源について考えるのに良い日。直感的な判断が吉を呼ぶ。" }
        }
      },
      // 他の組み合わせは既存のデータを使用
    }
    // 他の干支も同様...（簡略化）
  }
};

// デフォルトの運勢（定義されていない組み合わせ用）
const defaultFortune = {
  type: "普通日",
  keywords: ["平常", "日常", "安定", "継続", "調和"],
  genres: {
    love: { score: 70, description: "特別な変化はないが、日常の中に小さな幸せを見つけられる日。" },
    work: { score: 70, description: "普段通りのペースで取り組める日。無理をせず着実に進めよう。" },
    relationship: { score: 70, description: "人間関係は安定している。日常的なコミュニケーションを大切に。" },
    money: { score: 70, description: "大きな変化はないが、家計管理を見直すのに良い日。" }
  }
};

function getDayFortune(userZodiac, dayZodiac) {
  const userFortuneSet = dayFortuneData.combinations[userZodiac];
  if (!userFortuneSet) {
    return defaultFortune;
  }
  
  return userFortuneSet[dayZodiac] || defaultFortune;
}

// 天干から運勢を取得
function getHeavenlyStemFortune(heavenlyStem) {
  return HEAVENLY_STEM_FORTUNE_DATA[heavenlyStem] || {
    keywords: ["平常", "日常", "安定", "継続", "調和"],
    genres: {
      love: { score: 70, description: "特別な変化はないが、日常の中に小さな幸せを見つけられる日。" },
      work: { score: 70, description: "普段通りのペースで取り組める日。無理をせず着実に進めよう。" },
      relationship: { score: 70, description: "人間関係は安定している。日常的なコミュニケーションを大切に。" },
      money: { score: 70, description: "大きな変化はないが、家計管理を見直すのに良い日。" }
    }
  };
}

// 今日の干支を計算する関数（簡易版）
function getTodayZodiac() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const zodiacAnimals = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  return zodiacAnimals[dayOfYear % 12];
}

// 60干支のリスト
const GANZHI_LIST = [
  '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉', '甲戌', '乙亥',
  '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未', '甲申', '乙酉', '丙戌', '丁亥',
  '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳', '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥',
  '庚子', '辛丑', '壬寅', '癸卯', '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥',
  '壬子', '癸丑', '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'
];

// 今日の天干を計算
function getTodayHeavenlyStem() {
  const today = new Date();
  const baseDate = new Date(1900, 0, 1);
  const daysDiff = Math.floor((today - baseDate) / (1000 * 60 * 60 * 24));
  const ganzhi = GANZHI_LIST[daysDiff % 60];
  return ganzhi.charAt(0);
}

export async function POST(request) {
  try {
    const { userZodiac, userHeavenlyStem, targetDate } = await request.json();
    
    if (!userZodiac && !userHeavenlyStem) {
      return Response.json(
        { error: "ユーザーの干支または天干が必要です" },
        { status: 400 }
      );
    }
    
    let fortune;
    let fortuneType;
    let dateStr = targetDate || new Date().toISOString().split('T')[0];
    
    if (userHeavenlyStem) {
      // 天干ベースの運勢
      fortune = getHeavenlyStemFortune(userHeavenlyStem);
      fortuneType = "天干ベース";
      
      // 総合スコアを計算
      const totalScore = Math.round((
        fortune.genres.love.score +
        fortune.genres.work.score +
        fortune.genres.relationship.score +
        fortune.genres.money.score
      ) / 4);
      
      return Response.json({
        success: true,
        type: fortuneType,
        userHeavenlyStem,
        todayHeavenlyStem: getTodayHeavenlyStem(),
        fortune: {
          type: `${userHeavenlyStem}の日`,
          keywords: fortune.keywords,
          genres: fortune.genres,
          totalScore
        },
        date: dateStr
      });
      
    } else {
      // 従来の12支ベースの運勢
      let dayZodiac;
      if (targetDate) {
        const date = new Date(targetDate);
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const zodiacAnimals = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        dayZodiac = zodiacAnimals[dayOfYear % 12];
      } else {
        dayZodiac = getTodayZodiac();
      }
      
      const dayFortune = getDayFortune(userZodiac, dayZodiac);
      
      return Response.json({
        success: true,
        type: "12支ベース",
        userZodiac,
        dayZodiac,
        fortune: {
          type: dayFortune.type,
          keywords: dayFortune.keywords,
          genres: dayFortune.genres,
          totalScore: Math.round((
            dayFortune.genres.love.score + 
            dayFortune.genres.work.score + 
            dayFortune.genres.relationship.score + 
            dayFortune.genres.money.score
          ) / 4)
        },
        date: dateStr
      });
    }
    
  } catch (error) {
    console.error('Day Fortune API Error:', error);
    return Response.json(
      { error: "運勢の判定に失敗しました" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userZodiac = searchParams.get('userZodiac');
  const userHeavenlyStem = searchParams.get('userHeavenlyStem');
  const targetDate = searchParams.get('date');
  
  if (!userZodiac && !userHeavenlyStem) {
    return Response.json(
      { error: "ユーザーの干支または天干が必要です" },
      { status: 400 }
    );
  }
  
  try {
    let fortune;
    let fortuneType;
    let dateStr = targetDate || new Date().toISOString().split('T')[0];
    
    if (userHeavenlyStem) {
      // 天干ベースの運勢
      fortune = getHeavenlyStemFortune(userHeavenlyStem);
      fortuneType = "天干ベース";
      
      const totalScore = Math.round((
        fortune.genres.love.score +
        fortune.genres.work.score +
        fortune.genres.relationship.score +
        fortune.genres.money.score
      ) / 4);
      
      return Response.json({
        success: true,
        type: fortuneType,
        userHeavenlyStem,
        todayHeavenlyStem: getTodayHeavenlyStem(),
        fortune: {
          type: `${userHeavenlyStem}の日`,
          keywords: fortune.keywords,
          genres: fortune.genres,
          totalScore
        },
        date: dateStr
      });
      
    } else {
      // 従来の12支ベース
      let dayZodiac;
      if (targetDate) {
        const date = new Date(targetDate);
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const zodiacAnimals = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        dayZodiac = zodiacAnimals[dayOfYear % 12];
      } else {
        dayZodiac = getTodayZodiac();
      }
      
      const dayFortune = getDayFortune(userZodiac, dayZodiac);
      
      return Response.json({
        success: true,
        type: "12支ベース",
        userZodiac,
        dayZodiac,
        fortune: {
          type: dayFortune.type,
          keywords: dayFortune.keywords,
          genres: dayFortune.genres,
          totalScore: Math.round((
            dayFortune.genres.love.score + 
            dayFortune.genres.work.score + 
            dayFortune.genres.relationship.score + 
            dayFortune.genres.money.score
          ) / 4)
        },
        date: dateStr
      });
    }
    
  } catch (error) {
    console.error('Day Fortune API Error:', error);
    return Response.json(
      { error: "運勢の判定に失敗しました" },
      { status: 500 }
    );
  }
} 