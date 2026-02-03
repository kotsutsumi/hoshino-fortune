# Hoshino Fortune 実装計画

## 目的
Expo を使った占いアプリ（iOS/Android）と公式サイト・管理画面をモノレポで構築する。Stripe 決済、会員制（月額課金）、LINE 連携、管理画面による運用更新を実現する。

## 前提
- リポジトリ名: hoshino-fortune
- サービス名: Hoshino Fortune
- モノレポ構成
- Stripe で単品購入 + サブスクリプション
- LINE Login / Messaging API を利用

## スコープ（MVP）
### ユーザー向け
- 今日の運勢（無料）
- 占いコンテンツ一覧/詳細
- 単品購入（Stripe）
- 会員登録/ログイン（メール）
- 購入履歴

### 管理者向け
- 占いコンテンツ CRUD
- 占い師プロフィール管理
- 価格/公開状態管理
- ユーザー管理
- 売上の簡易ダッシュボード

## 追加スコープ（Phase 2 以降）
- 月額課金（Stripe Subscription）
- LINE Login
- LINE 通知（今日の運勢/期限通知）
- レコメンド/キャンペーン

## 技術スタック
- Mobile: Expo (React Native), Expo Router
- Web: Next.js (公式サイト/管理画面)
- Backend: Node.js (Hono or NestJS)
- DB: PostgreSQL + Prisma
- Cache/Queue: Redis（必要に応じて）
- Payments: Stripe
- Auth: JWT + LINE Login

## 想定モノレポ構成
```
apps/
  mobile/      # Expo アプリ
  web/         # 公式サイト
  admin/       # 管理画面
backend/
  api/         # API サーバー
  prisma/      # DB スキーマ
packages/
  ui/          # 共通 UI
  api-client/  # 型安全 API クライアント
  constants/   # 定数
  config/      # ESLint/TSConfig
```

## 主要データモデル（概略）
- User: email, lineUserId, profile, status
- FortuneTeller: profile, isActive
- FortuneContent: title, description, type, price, teller
- Purchase: user, content, stripePaymentId
- Subscription: user, plan, status, currentPeriodEnd
- AdminUser: role

## 外部連携
- Stripe
  - PaymentIntent（単品）
  - Subscription（定期）
  - Webhook で状態同期（Stripe 正）
- LINE
  - Login（OAuth）
  - Messaging API（通知）

## 画面構成（MVP）
### アプリ
- Home
- Fortune List
- Fortune Detail
- Purchase
- My Page

### Web
- トップ/料金/FAQ/特商法/プライバシー

### 管理画面
- Dashboard
- Contents
- FortuneTellers
- Users

## 実装フェーズ
### Phase 1: MVP
- モノレポ初期化（pnpm + turbo など）
- Expo/Next.js 雛形
- API/DB 基盤（Prisma）
- 単品購入 + Webhook
- 管理画面最小機能

### Phase 2
- 月額課金
- LINE Login
- LINE 通知

### Phase 3
- 占い師追加/拡張
- レコメンド
- キャンペーン

## マイルストーン（例）
- M1: モノレポ/基盤構築完了
- M2: 単品購入 + 管理画面 MVP 完了
- M3: 月額課金 + LINE 連携完了

## 受入条件（MVP）
- アプリで占いを閲覧/購入できる
- Stripe 決済が正常に完了し購入履歴が記録される
- 管理画面から占い/占い師を更新できる

## リスクと対策
- 決済/課金の不整合: Webhook による状態同期を必須化
- LINE 連携の審査: 早期に開発者アカウント/申請を実施
- コンテンツ運用負荷: 管理画面の運用 UX を優先

## 次のアクション
- README/初期設計ドキュメントの整備
- DB 設計の詳細化
- Stripe/LINE の接続検証
