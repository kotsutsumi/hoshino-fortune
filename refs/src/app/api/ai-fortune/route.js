import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    const { 
      userZodiac, 
      userHeavenlyStem,
      dayZodiac, 
      dayHeavenlyStem,
      dayFortuneData, 
      userTraits, 
      specificQuestion, 
      fortuneType = "general" 
    } = await request.json();
    
    // 天干ベースまたは干支ベースの検証
    if (!userZodiac && !userHeavenlyStem) {
      return Response.json(
        { error: "ユーザーの干支または天干が必要です" },
        { status: 400 }
      );
    }
    
    if (!dayZodiac && !dayHeavenlyStem) {
      return Response.json(
        { error: "その日の干支または天干が必要です" },
        { status: 400 }
      );
    }
    
    if (!dayFortuneData) {
      return Response.json(
        { error: "基本運勢データが必要です" },
        { status: 400 }
      );
    }
    
    try {
      // プロンプトを構築（天干ベースまたは干支ベース）
      const prompt = buildFortunePrompt({ 
        userZodiac, 
        userHeavenlyStem,
        dayZodiac, 
        dayHeavenlyStem,
        dayFortuneData, 
        userTraits, 
        specificQuestion, 
        fortuneType 
      });
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `あなたは経験豊富な占い師です。四柱推命と干支占いの専門家として、天干（甲乙丙丁戊己庚辛壬癸）と十神の知識を活用し、具体的で実践的なアドバイスを提供してください。

【重要なポイント】
- 天干ベースの場合は、五行（木火土金水）と陰陽の関係性を重視
- 十神の意味を深く理解して運勢を解釈
- **基本キーワード（5つ）のみを情報源として、完全にオリジナルなアドバイスを生成**
- キーワードの精神性や意味を深く理解し、それを各ジャンルに展開
- 4つのジャンル（恋愛・仕事・人間関係・金運）それぞれに具体的で実践的なアドバイス
- 各ジャンルには詳細なアドバイスと一言キャッチコピーの両方を提供
- 今日一日の行動指針を明確に提示
- 占い結果は前向きで建設的な内容に

【基本キーワードの創造的活用方法】
■ 多角的解釈パターン：
1. **ポジティブ転換**: ネガティブなキーワード（例：「短気」）→ 「決断力」「即応力」として解釈
2. **ジャンル別適用**: 同じキーワードを各ジャンルの特性に合わせて変換
   - 「行動力」→ 恋愛：積極性、仕事：実行力、人間関係：リーダーシップ、金運：投資判断力
3. **組み合わせ創造**: 複数キーワードを組み合わせて新しい概念を創出
   - 「挑戦的自己効力感」+「行動力」→ 「勇気ある自己実現」
4. **段階的展開**: キーワードを行動の段階に分解
   - 「突破力」→ 準備段階：計画力、実行段階：推進力、完了段階：達成力

■ キャッチコピーの多様化技法：
- **行動促進型**: 「〜しよう」「〜で進もう」
- **自己肯定型**: 「〜を信じて」「〜が力になる」
- **未来志向型**: 「〜が道を開く」「〜で輝こう」
- **関係性重視型**: 「〜でつながろう」「〜で支え合おう」
- **成長実感型**: 「〜で成長しよう」「〜を育もう」

■ アドバイスの表現バリエーション：
- **具体的行動提案**: 「朝一番に〜する」「午後は〜に集中」
- **心構え重視**: 「〜の気持ちで」「〜を意識して」
- **タイミング活用**: 「今日こそ〜」「このチャンスに〜」
- **バランス調整**: 「〜しつつも〜に注意」「〜と〜の両立を」
- **段階的アプローチ**: 「まずは〜から」「次に〜へ」

【創造性を高める指示】
- 同じキーワードでも、毎回異なる角度から解釈してください
- ジャンル間で表現スタイルを変化させてください
- キーワードの「裏の意味」や「発展的解釈」も活用してください
- 季節感、時代性、現代的な課題も織り込んでください
- 読み手が「なるほど！」と感じる新鮮な視点を提供してください

【出力形式】
必ず以下のJSON形式で回答してください：
{
  "overallMessage": "全体的なメッセージ（100文字程度）",
  "detailedAdvice": {
    "love": {
      "catchphrase": "恋愛に関する一言キャッチコピー（例：自分を信じて進もう）",
      "advice": "恋愛運の詳細アドバイス（150文字程度）"
    },
    "work": {
      "catchphrase": "仕事に関する一言キャッチコピー（例：挑戦こそが成長の鍵）",
      "advice": "仕事運の詳細アドバイス（150文字程度）"
    },
    "relationship": {
      "catchphrase": "人間関係に関する一言キャッチコピー（例：つながりが力になる）",
      "advice": "人間関係運の詳細アドバイス（150文字程度）"
    },
    "money": {
      "catchphrase": "金運に関する一言キャッチコピー（例：勇気ある判断が道を開く）",
      "advice": "金運の詳細アドバイス（150文字程度）"
    }
  },
  "actionGuide": "今日の具体的な行動指針（100文字程度）",
  "luckyItem": "ラッキーアイテム",
  "luckyColor": "ラッキーカラー",
  "luckyNumber": "ラッキーナンバー（1-99の数字）"
}`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.7,
      });
      
      const fortuneResult = completion.choices[0].message.content;
      const structuredResult = parseFortuneResult(fortuneResult, dayFortuneData);
      
      return Response.json({
        success: true,
        fortune: {
          ...structuredResult,
          userZodiac: userZodiac || null,
          userHeavenlyStem: userHeavenlyStem || null,
          dayZodiac: dayZodiac || null,
          dayHeavenlyStem: dayHeavenlyStem || null,
          baseFortune: dayFortuneData,
          generatedAt: new Date().toISOString(),
          fortuneType,
          isAIGenerated: true,
          systemType: userHeavenlyStem ? "天干ベース" : "12支ベース"
        }
      });
      
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      
      // OpenAI APIエラーの場合は、フォールバック運勢を生成
      const fallbackFortune = generateFallbackFortune(dayFortuneData, userHeavenlyStem || userZodiac);
      
      return Response.json({
        success: true,
        fortune: {
          ...fallbackFortune,
          userZodiac: userZodiac || null,
          userHeavenlyStem: userHeavenlyStem || null,
          dayZodiac: dayZodiac || null,
          dayHeavenlyStem: dayHeavenlyStem || null,
          baseFortune: dayFortuneData,
          generatedAt: new Date().toISOString(),
          fortuneType,
          isAIGenerated: false,
          systemType: userHeavenlyStem ? "天干ベース" : "12支ベース",
          note: "AI生成に失敗したため、基本運勢データを使用しています"
        }
      });
    }
    
  } catch (error) {
    console.error('AI Fortune API Error:', error);
    return Response.json(
      { error: "AI占いの生成に失敗しました" },
      { status: 500 }
    );
  }
}

function buildFortunePrompt({ 
  userZodiac, 
  userHeavenlyStem, 
  dayZodiac, 
  dayHeavenlyStem, 
  dayFortuneData, 
  userTraits, 
  specificQuestion, 
  fortuneType 
}) {
  let prompt = `今日の占いをお願いします。\n\n【基本情報】\n`;
  
  // 天干ベースまたは干支ベースで情報を構築
  if (userHeavenlyStem && dayHeavenlyStem) {
    prompt += `・あなたの天干: ${userHeavenlyStem}\n`;
    prompt += `・今日の天干: ${dayHeavenlyStem}\n`;
    prompt += `・天干の組み合わせ: ${userHeavenlyStem} → ${dayHeavenlyStem}\n`;
  } else {
    prompt += `・あなたの干支: ${userZodiac}年生まれ\n`;
    prompt += `・今日の干支: ${dayZodiac}の日\n`;
  }
  
  prompt += `・今日の運勢タイプ: ${dayFortuneData.type}\n`;
  prompt += `・基本キーワード: ${dayFortuneData.keywords.join(', ')}\n\n`;
  
  prompt += `【4つのジャンルのスコア】\n`;
  prompt += `・恋愛運: ${dayFortuneData.genres.love.score}/100\n`;
  prompt += `・仕事運: ${dayFortuneData.genres.work.score}/100\n`;
  prompt += `・人間関係運: ${dayFortuneData.genres.relationship.score}/100\n`;
  prompt += `・金運: ${dayFortuneData.genres.money.score}/100\n\n`;
  
  // 創造性を促進するランダムな指示を追加
  const creativityPrompts = [
    "【今回の解釈アプローチ】\n各キーワードを「成長のステップ」として捉え、段階的な発展を意識したアドバイスを提供してください。",
    "【今回の解釈アプローチ】\n各キーワードを「人間関係の力学」として捉え、他者との相互作用を重視したアドバイスを提供してください。",
    "【今回の解釈アプローチ】\n各キーワードを「変化のエネルギー」として捉え、転換点や新しい始まりを意識したアドバイスを提供してください。",
    "【今回の解釈アプローチ】\n各キーワードを「内面の力」として捉え、精神的な成長や自己実現を重視したアドバイスを提供してください。",
    "【今回の解釈アプローチ】\n各キーワードを「行動の原動力」として捉え、具体的な実践方法を重視したアドバイスを提供してください。",
    "【今回の解釈アプローチ】\n各キーワードを「バランスの要素」として捉え、調和と安定を意識したアドバイスを提供してください。"
  ];
  
  const randomApproach = creativityPrompts[Math.floor(Math.random() * creativityPrompts.length)];
  prompt += randomApproach + "\n\n";
  
  // キーワードの特別な解釈ヒントを追加
  const keywordHints = [
    "【キーワード活用ヒント】\nポジティブなキーワードは「強み」として、ネガティブなキーワードは「注意点を活かした成長機会」として解釈してください。",
    "【キーワード活用ヒント】\n各キーワードを「今日特有のチャンス」として捉え、この日だからこそできることを提案してください。",
    "【キーワード活用ヒント】\n複数のキーワードを組み合わせて、新しい視点や独創的なアドバイスを創造してください。",
    "【キーワード活用ヒント】\n各キーワードの「反対の意味」も考慮し、バランスの取れたアドバイスを提供してください。",
    "【キーワード活用ヒント】\n現代社会の課題（リモートワーク、SNS、ライフワークバランス等）と関連付けて解釈してください。"
  ];
  
  const randomHint = keywordHints[Math.floor(Math.random() * keywordHints.length)];
  prompt += randomHint + "\n\n";
  
  if (userTraits) {
    prompt += `【あなたの特徴】\n${userTraits}\n\n`;
  }
  
  // 占いの種類に応じてプロンプトを調整
  switch (fortuneType) {
    case "love":
      prompt += `【特に重視してほしいポイント】\n恋愛運を中心に、基本キーワードの精神を活かした詳細なアドバイスをお願いします。出会い、既存の関係の発展、結婚などについて具体的に教えてください。`;
      break;
    case "work":
      prompt += `【特に重視してほしいポイント】\n仕事運を中心に、基本キーワードの精神を活かした詳細なアドバイスをお願いします。転職、昇進、新しいプロジェクト、人間関係などについて具体的に教えてください。`;
      break;
    case "money":
      prompt += `【特に重視してほしいポイント】\n金運を中心に、基本キーワードの精神を活かした詳細なアドバイスをお願いします。投資、副業、貯蓄、大きな買い物などについて具体的に教えてください。`;
      break;
    case "relationship":
      prompt += `【特に重視してほしいポイント】\n人間関係運を中心に、基本キーワードの精神を活かした詳細なアドバイスをお願いします。友人関係、家族関係、職場の人間関係などについて具体的に教えてください。`;
      break;
    default:
      prompt += `【特に重視してほしいポイント】\n基本キーワードの精神を活かして、今日一日を充実して過ごすためのアドバイスをお願いします。各ジャンルのスコアを参考に、バランスの取れたアドバイスを提供してください。`;
  }
  
  if (specificQuestion) {
    prompt += `\n\n【特に知りたいこと】\n${specificQuestion}`;
  }
  
  // 最後に創造性を促す締めの言葉を追加
  const creativityClosing = [
    "\n\n【重要】同じキーワードでも、今回は全く新しい角度から解釈し、読み手が驚くような新鮮なアドバイスを提供してください。",
    "\n\n【重要】キーワードの組み合わせから生まれる「化学反応」を意識し、予想外の洞察を提供してください。",
    "\n\n【重要】今日という特別な日にふさわしい、その人だけのオリジナルなメッセージを創造してください。"
  ];
  
  const randomClosing = creativityClosing[Math.floor(Math.random() * creativityClosing.length)];
  prompt += randomClosing;
  
  return prompt;
}

function parseFortuneResult(fortuneText, baseFortune) {
  try {
    // JSON形式での回答を試みる
    const jsonMatch = fortuneText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonResult = JSON.parse(jsonMatch[0]);
      return {
        overallMessage: jsonResult.overallMessage || "今日は良い一日になりそうです。",
        detailedAdvice: {
          love: {
            catchphrase: jsonResult.detailedAdvice?.love?.catchphrase || "恋愛に関する一言キャッチコピー",
            advice: jsonResult.detailedAdvice?.love?.advice || baseFortune.genres.love.description
          },
          work: {
            catchphrase: jsonResult.detailedAdvice?.work?.catchphrase || "仕事に関する一言キャッチコピー",
            advice: jsonResult.detailedAdvice?.work?.advice || baseFortune.genres.work.description
          },
          relationship: {
            catchphrase: jsonResult.detailedAdvice?.relationship?.catchphrase || "人間関係に関する一言キャッチコピー",
            advice: jsonResult.detailedAdvice?.relationship?.advice || baseFortune.genres.relationship.description
          },
          money: {
            catchphrase: jsonResult.detailedAdvice?.money?.catchphrase || "金運に関する一言キャッチコピー",
            advice: jsonResult.detailedAdvice?.money?.advice || baseFortune.genres.money.description
          }
        },
        actionGuide: jsonResult.actionGuide || "今日のキーワードを意識して行動しましょう。",
        luckyItem: jsonResult.luckyItem || "手帳",
        luckyColor: jsonResult.luckyColor || "青",
        luckyNumber: jsonResult.luckyNumber || Math.floor(Math.random() * 99) + 1
      };
    }
  } catch (parseError) {
    console.log('JSON解析に失敗、テキスト解析にフォールバック');
  }
  
  // JSON解析に失敗した場合のテキスト解析
  return {
    overallMessage: "今日は" + baseFortune.type + "です。" + baseFortune.keywords.slice(0, 2).join("と") + "を意識して過ごしましょう。",
    detailedAdvice: {
      love: {
        catchphrase: "恋愛に関する一言キャッチコピー",
        advice: baseFortune.genres.love.description + " 相手との時間を大切にしてください。"
      },
      work: {
        catchphrase: "仕事に関する一言キャッチコピー",
        advice: baseFortune.genres.work.description + " 計画的に進めることが成功の鍵です。"
      },
      relationship: {
        catchphrase: "人間関係に関する一言キャッチコピー",
        advice: baseFortune.genres.relationship.description + " コミュニケーションを心がけましょう。"
      },
      money: {
        catchphrase: "金運に関する一言キャッチコピー",
        advice: baseFortune.genres.money.description + " 無駄遣いに注意して過ごしてください。"
      }
    },
    actionGuide: baseFortune.keywords[0] + "を意識して、" + baseFortune.keywords[1] + "な気持ちで一日を過ごしましょう。",
    luckyItem: ["手帳", "ペン", "花", "本", "お守り"][Math.floor(Math.random() * 5)],
    luckyColor: ["青", "緑", "赤", "黄", "紫"][Math.floor(Math.random() * 5)],
    luckyNumber: Math.floor(Math.random() * 99) + 1
  };
}

function generateFallbackFortune(dayFortuneData, userIdentifier) {
  const systemType = userIdentifier?.length === 1 ? "天干ベース" : "12支ベース";
  
  return {
    overallMessage: `今日は${dayFortuneData.type}です。${dayFortuneData.keywords.slice(0, 2).join("と")}を大切にして、充実した一日をお過ごしください。`,
    detailedAdvice: {
      love: {
        catchphrase: "恋愛に関する一言キャッチコピー",
        advice: dayFortuneData.genres.love.description + " 素直な気持ちを大切にしましょう。"
      },
      work: {
        catchphrase: "仕事に関する一言キャッチコピー",
        advice: dayFortuneData.genres.work.description + " 焦らず着実に進めることが大切です。"
      },
      relationship: {
        catchphrase: "人間関係に関する一言キャッチコピー",
        advice: dayFortuneData.genres.relationship.description + " 相手の立場に立って考えてみてください。"
      },
      money: {
        catchphrase: "金運に関する一言キャッチコピー",
        advice: dayFortuneData.genres.money.description + " 計画的な管理を心がけましょう。"
      }
    },
    actionGuide: `${dayFortuneData.keywords[0]}を意識して、前向きな気持ちで一日を始めましょう。小さな幸せを見つけることができそうです。`,
    luckyItem: ["観葉植物", "青いペン", "小さな鏡", "お気に入りの本", "温かい飲み物"][Math.floor(Math.random() * 5)],
    luckyColor: ["深緑", "紺色", "オレンジ", "ラベンダー", "ゴールド"][Math.floor(Math.random() * 5)],
    luckyNumber: Math.floor(Math.random() * 99) + 1,
    systemNote: `${systemType}による基本運勢データを使用`
  };
} 