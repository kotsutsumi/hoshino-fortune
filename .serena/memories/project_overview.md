# Hoshino Fortune - プロジェクト概要

## 目的
占いアプリ（iOS/Android）と公式サイト・管理画面をモノレポで構築。Stripe 決済、会員制（月額課金）、LINE 連携を実現。

## 構成

### アプリ
- `apps/backend`: Next.js 16 (Admin, API, Web)
- `apps/frontend`: Expo 54 + Expo Router (iOS/Android)

### パッケージ
- `packages/domain`: 型定義、Zod スキーマ
- `packages/api`: 共有 API クライアント
- `packages/config`: 環境変数バリデーション、共有設定
- `packages/ui`: 共有 UI コンポーネント

## 技術スタック

### 共通
- TypeScript 5 (strict)
- Zod (バリデーション)
- Jotai (状態管理)
- Bun (パッケージマネージャ)
- Turborepo (ビルドパイプライン)

### Backend (Next.js)
- Next.js 16 + App Router
- React 19
- Tailwind CSS 4
- shadcn/ui
- Drizzle ORM + Turso (LibSQL)
- BetterAuth (認証)
- Stripe (決済)

### Frontend (Expo)
- Expo 54
- React Native 0.81
- Expo Router 6
- React 19

## データベース
- Turso (LibSQL) + Drizzle ORM
- 主要テーブル: users, sessions, accounts, verifications, fortune_tellers, fortune_contents, purchases, subscriptions

## 外部連携
- Stripe: PaymentIntent (単品)、Subscription (定期)、Webhook
- LINE: Login (OAuth)、Messaging API (通知)
