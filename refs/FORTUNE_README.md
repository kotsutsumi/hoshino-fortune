# 暦占いAI 🔮

OpenAI APIのFunction CallingとJSONモードを使用した暦占い判定AIです。

## 機能

- 干支、五行、天干、地支の組み合わせから運勢を分析
- OpenAI APIのFunction Callingを使用した高精度な占い結果
- JSONモードでの構造化された出力
- 3つのキーワードとそれぞれの説明文を生成

## セットアップ

1. 依存関係をインストール:
```bash
pip install -r requirements.txt
```

2. 環境変数を設定:
`.env`ファイルを作成し、以下の内容を記入してください:
```
OPENAI_API_KEY=your_openai_api_key_here
```

OpenAI APIキーは https://platform.openai.com/api-keys から取得できます。

## 使用方法

```bash
python calendar_fortune_ai.py
```

## 出力例

```
🌟 暦占い結果 🌟
==================================================

📅 今日の暦の組み合わせ:
   干支: 寅
   五行: 木
   天干: 甲
   地支: 寅

🔮 占い結果:
   甲寅で、木の気が強い成長の日です

✨ 今日のキーワード:
   1. 【成長】
      新しい挑戦を始めるのに最適な日です
   2. 【勇気】
      困難に立ち向かう力が湧いてきます
   3. 【創造】
      アイデアが豊富に生まれる創造的な一日です
```

## ファイル構成

- `calendar_fortune_ai.py`: メインプログラム
- `requirements.txt`: 依存関係
- `fortune_result.json`: 占い結果の保存ファイル（実行後に生成）

## 技術仕様

- OpenAI GPT-4 Turbo Preview
- Function Calling機能
- JSON Mode
- Python 3.7+ 