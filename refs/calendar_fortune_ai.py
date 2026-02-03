#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import openai
import json
import random
from datetime import datetime
from typing import Dict, List, Any
import os
from dotenv import load_dotenv

# 環境変数を読み込み
load_dotenv()

class CalendarFortuneAI:
    def __init__(self):
        # OpenAI APIキーを設定
        openai.api_key = os.getenv('OPENAI_API_KEY')
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # 暦の要素
        self.zodiac_animals = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
        self.five_elements = ["木", "火", "土", "金", "水"]
        self.heavenly_stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
        self.earthly_branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
        
    def get_calendar_combination(self) -> Dict[str, str]:
        """暦の組み合わせを生成"""
        return {
            "干支": random.choice(self.zodiac_animals),
            "五行": random.choice(self.five_elements),
            "天干": random.choice(self.heavenly_stems),
            "地支": random.choice(self.earthly_branches)
        }
    
    def fortune_analysis_function(self, calendar_combo: Dict[str, str]) -> Dict[str, Any]:
        """Function calling用の占い分析関数"""
        
        # Function callingの定義
        functions = [
            {
                "name": "analyze_fortune",
                "description": "暦の組み合わせから運勢を分析し、キーワードと説明文を生成する",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "combination_description": {
                            "type": "string",
                            "description": "暦の組み合わせの説明"
                        },
                        "day_type": {
                            "type": "string", 
                            "description": "その日の特徴を表す形容詞"
                        },
                        "keywords": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "運勢を表す3つのキーワード",
                            "minItems": 3,
                            "maxItems": 3
                        },
                        "keyword_descriptions": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "各キーワードに対応する簡単な説明文",
                            "minItems": 3,
                            "maxItems": 3
                        }
                    },
                    "required": ["combination_description", "day_type", "keywords", "keyword_descriptions"]
                }
            }
        ]
        
        # プロンプトを作成
        prompt = f"""
        今日の暦の組み合わせは以下の通りです：
        - 干支: {calendar_combo['干支']}
        - 五行: {calendar_combo['五行']}
        - 天干: {calendar_combo['天干']}
        - 地支: {calendar_combo['地支']}
        
        この組み合わせから暦占いを行い、以下の形式で結果を提供してください：
        1. 組み合わせの説明（「〇〇で、〇〇な日です」の形式）
        2. その日の特徴を表す形容詞
        3. 運勢を表す3つのキーワード
        4. 各キーワードに対する簡単な説明文
        
        古典的な暦占いの知識に基づいて、ポジティブで希望に満ちた占い結果を生成してください。
        """
        
        try:
            # OpenAI APIを呼び出し（function calling使用）
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {
                        "role": "system", 
                        "content": "あなたは暦占いの専門家です。古典的な暦学の知識を活用して、正確で意味のある占い結果を提供してください。"
                    },
                    {"role": "user", "content": prompt}
                ],
                functions=functions,
                function_call={"name": "analyze_fortune"},
                response_format={"type": "json_object"}
            )
            
            # Function callingの結果を解析
            function_call = response.choices[0].message.function_call
            if function_call and function_call.name == "analyze_fortune":
                result = json.loads(function_call.arguments)
                return result
            else:
                raise Exception("Function calling failed")
                
        except Exception as e:
            print(f"API呼び出しエラー: {e}")
            # フォールバック結果
            return {
                "combination_description": f"{calendar_combo['天干']}{calendar_combo['地支']}で、{calendar_combo['五行']}の気が強い調和の日",
                "day_type": "穏やかな",
                "keywords": ["調和", "成長", "幸運"],
                "keyword_descriptions": [
                    "周囲との調和が取れやすい一日です",
                    "新しいことを始めるのに適した成長の時期です", 
                    "小さな幸運が舞い込みやすい日です"
                ]
            }
    
    def generate_fortune(self) -> Dict[str, Any]:
        """暦占いを実行"""
        print("🔮 暦占いAIが運勢を分析中...")
        
        # 暦の組み合わせを取得
        calendar_combo = self.get_calendar_combination()
        print(f"📅 今日の暦: {calendar_combo}")
        
        # 占い分析を実行
        fortune_result = self.fortune_analysis_function(calendar_combo)
        
        # 結果をまとめる
        complete_result = {
            "calendar_combination": calendar_combo,
            "fortune_analysis": fortune_result,
            "timestamp": datetime.now().isoformat()
        }
        
        return complete_result
    
    def display_fortune(self, result: Dict[str, Any]):
        """占い結果を表示"""
        print("\n" + "="*50)
        print("🌟 暦占い結果 🌟")
        print("="*50)
        
        calendar = result["calendar_combination"]
        fortune = result["fortune_analysis"]
        
        print(f"\n📅 今日の暦の組み合わせ:")
        print(f"   干支: {calendar['干支']}")
        print(f"   五行: {calendar['五行']}")
        print(f"   天干: {calendar['天干']}")
        print(f"   地支: {calendar['地支']}")
        
        print(f"\n🔮 占い結果:")
        print(f"   {fortune['combination_description']}")
        
        print(f"\n✨ 今日のキーワード:")
        for i, (keyword, description) in enumerate(zip(fortune['keywords'], fortune['keyword_descriptions']), 1):
            print(f"   {i}. 【{keyword}】")
            print(f"      {description}")
        
        print(f"\n⏰ 占い実行時刻: {result['timestamp']}")
        print("="*50)

def main():
    """メイン実行関数"""
    try:
        # 暦占いAIを初期化
        fortune_ai = CalendarFortuneAI()
        
        # 占いを実行
        result = fortune_ai.generate_fortune()
        
        # 結果を表示
        fortune_ai.display_fortune(result)
        
        # JSONファイルとして保存
        with open('fortune_result.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print("\n💾 結果をfortune_result.jsonに保存しました")
        
    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")

if __name__ == "__main__":
    main() 