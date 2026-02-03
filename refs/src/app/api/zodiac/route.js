// 干支のモックデータ（天干情報も含む）
const zodiacData = {
  animals: [
    { id: 1, name: "子", animal: "鼠", years: [1960, 1972, 1984, 1996, 2008, 2020], traits: "知恵深く、適応力がある" },
    { id: 2, name: "丑", animal: "牛", years: [1961, 1973, 1985, 1997, 2009, 2021], traits: "忍耐強く、誠実" },
    { id: 3, name: "寅", animal: "虎", years: [1962, 1974, 1986, 1998, 2010, 2022], traits: "勇敢で情熱的" },
    { id: 4, name: "卯", animal: "兎", years: [1963, 1975, 1987, 1999, 2011, 2023], traits: "優しく、平和主義" },
    { id: 5, name: "辰", animal: "龍", years: [1964, 1976, 1988, 2000, 2012, 2024], traits: "力強く、カリスマ性がある" },
    { id: 6, name: "巳", animal: "蛇", years: [1965, 1977, 1989, 2001, 2013, 2025], traits: "知的で神秘的" },
    { id: 7, name: "午", animal: "馬", years: [1966, 1978, 1990, 2002, 2014, 2026], traits: "自由奔放で活動的" },
    { id: 8, name: "未", animal: "羊", years: [1967, 1979, 1991, 2003, 2015, 2027], traits: "穏やかで芸術的" },
    { id: 9, name: "申", animal: "猿", years: [1968, 1980, 1992, 2004, 2016, 2028], traits: "機知に富み、社交的" },
    { id: 10, name: "酉", animal: "鶏", years: [1969, 1981, 1993, 2005, 2017, 2029], traits: "几帳面で責任感が強い" },
    { id: 11, name: "戌", animal: "犬", years: [1970, 1982, 1994, 2006, 2018, 2030], traits: "忠実で正義感が強い" },
    { id: 12, name: "亥", animal: "猪", years: [1971, 1983, 1995, 2007, 2019, 2031], traits: "純粋で勇敢" }
  ]
};

// 天干データ
const HEAVENLY_STEMS = [
  { name: "甲", element: "木", polarity: "陽", meaning: "大木", characteristics: ["成長力", "リーダーシップ", "開拓精神"] },
  { name: "乙", element: "木", polarity: "陰", meaning: "草花", characteristics: ["柔軟性", "協調性", "美意識"] },
  { name: "丙", element: "火", polarity: "陽", meaning: "太陽", characteristics: ["明朗", "積極性", "創造力"] },
  { name: "丁", element: "火", polarity: "陰", meaning: "灯火", characteristics: ["温かさ", "思いやり", "芸術性"] },
  { name: "戊", element: "土", polarity: "陽", meaning: "山", characteristics: ["安定性", "責任感", "包容力"] },
  { name: "己", element: "土", polarity: "陰", meaning: "田畑", characteristics: ["忍耐力", "育成力", "現実性"] },
  { name: "庚", element: "金", polarity: "陽", meaning: "鉄", characteristics: ["意志力", "正義感", "行動力"] },
  { name: "辛", element: "金", polarity: "陰", meaning: "宝石", characteristics: ["繊細さ", "美意識", "完璧主義"] },
  { name: "壬", element: "水", polarity: "陽", meaning: "大河", characteristics: ["流動性", "適応力", "知恵"] },
  { name: "癸", element: "水", polarity: "陰", meaning: "雨露", characteristics: ["直感力", "神秘性", "浄化力"] }
];

// 60干支のリスト
const GANZHI_LIST = [
  '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉', '甲戌', '乙亥',
  '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未', '甲申', '乙酉', '丙戌', '丁亥',
  '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳', '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥',
  '庚子', '辛丑', '壬寅', '癸卯', '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥',
  '壬子', '癸丑', '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'
];

function getZodiacByYear(year) {
  // 干支は12年周期なので、年を12で割った余りで判定
  const baseYear = 1960; // 子年
  const yearDiff = year - baseYear;
  const zodiacIndex = yearDiff % 12;
  
  // 負の値の場合の調整
  const adjustedIndex = zodiacIndex < 0 ? zodiacIndex + 12 : zodiacIndex;
  
  return zodiacData.animals[adjustedIndex];
}

// 年月日から干支を計算
function calculateGanzhi(year, month, day) {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const daysDiff = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
  
  return GANZHI_LIST[daysDiff % 60];
}

// 干支から天干と地支を抽出
function parseGanzhi(ganzhi) {
  const heavenlyStem = ganzhi.charAt(0);
  const earthlyBranch = ganzhi.charAt(1);
  
  const heavenlyData = HEAVENLY_STEMS.find(stem => stem.name === heavenlyStem);
  const earthlyData = zodiacData.animals.find(animal => animal.name === earthlyBranch);
  
  return {
    ganzhi,
    heavenlyStem: heavenlyData,
    earthlyBranch: earthlyData
  };
}

export async function POST(request) {
  try {
    const { birthDate } = await request.json();
    
    if (!birthDate) {
      return Response.json(
        { error: "生年月日が必要です" },
        { status: 400 }
      );
    }
    
    const year = new Date(birthDate).getFullYear();
    const month = new Date(birthDate).getMonth() + 1;
    const day = new Date(birthDate).getDate();
    
    // 12支による干支判定
    const zodiac = getZodiacByYear(year);
    
    // 日干支の計算
    const dayGanzhi = calculateGanzhi(year, month, day);
    const ganzhiInfo = parseGanzhi(dayGanzhi);
    
    return Response.json({
      success: true,
      birthDate,
      // 年の干支（12支）
      yearZodiac: {
        zodiac: zodiac,
        year: year
      },
      // 日の干支（60干支）
      dayGanzhi: ganzhiInfo,
      // 天干情報（重要）
      heavenlyStem: ganzhiInfo.heavenlyStem,
      // 地支情報
      earthlyBranch: ganzhiInfo.earthlyBranch
    });
    
  } catch (error) {
    console.error('Zodiac API Error:', error);
    return Response.json(
      { error: "干支の判定に失敗しました" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year'));
  const birthDate = searchParams.get('birthDate');
  
  try {
    if (birthDate) {
      // 生年月日が指定された場合
      const dateObj = new Date(birthDate);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      
      const zodiac = getZodiacByYear(year);
      const dayGanzhi = calculateGanzhi(year, month, day);
      const ganzhiInfo = parseGanzhi(dayGanzhi);
      
      return Response.json({
        success: true,
        birthDate,
        yearZodiac: { zodiac, year },
        dayGanzhi: ganzhiInfo,
        heavenlyStem: ganzhiInfo.heavenlyStem,
        earthlyBranch: ganzhiInfo.earthlyBranch
      });
    } else if (year) {
      // 年のみが指定された場合
      const zodiac = getZodiacByYear(year);
      
      return Response.json({
        success: true,
        yearZodiac: { zodiac, year }
      });
    } else {
      return Response.json(
        { error: "年または生年月日が必要です" },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Zodiac API Error:', error);
    return Response.json(
      { error: "干支の判定に失敗しました" },
      { status: 500 }
    );
  }
} 