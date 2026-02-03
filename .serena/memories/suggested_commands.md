# 推奨コマンド一覧

## セットアップ
```bash
# 依存関係インストール
bun install

# 環境変数設定
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
```

## 開発
```bash
# 全アプリ同時起動
bun dev

# Backend のみ
cd apps/backend && bun dev

# Frontend のみ
cd apps/frontend && bun start
```

## ビルド
```bash
# 全体ビルド
bun build

# Backend のみ
cd apps/backend && bun build
```

## Lint
```bash
# 全体
bun lint

# Backend のみ
cd apps/backend && bun lint
```

## データベース
```bash
# スキーマ変更をプッシュ
cd apps/backend && bun x drizzle-kit push

# マイグレーション生成
cd apps/backend && bun x drizzle-kit generate

# Drizzle Studio (DB GUI)
cd apps/backend && bun x drizzle-kit studio
```

## モバイル
```bash
cd apps/frontend

# iOS シミュレータ
bun ios

# Android エミュレータ
bun android

# Metro bundler のみ
bun start
```

## システムユーティリティ (Linux)
- `ls`, `cd`, `grep`, `find`: 標準 Unix コマンド
- `git`: バージョン管理
- `bun`: パッケージマネージャ兼ランタイム
