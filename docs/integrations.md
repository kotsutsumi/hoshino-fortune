# Stripe / LINE 連携検証（チェックリスト）

## Stripe
### 事前準備
- Stripe アカウント作成
- テストモード API キー取得
- Webhook エンドポイント作成

### 単品購入（PaymentIntent）
- PaymentIntent 作成
- クライアントシークレット受け渡し
- 決済成功の受信（Webhook）
- purchases に反映

### 月額課金（Subscription）
- 価格/プラン作成
- Subscription 作成
- invoice.paid / customer.subscription.updated を受信
- subscriptions に同期

### 失敗/返金
- 支払い失敗イベントの処理
- 返金イベントの処理

## LINE Login
### 事前準備
- LINE Developers でプロバイダ作成
- チャネル作成（Login）
- Callback URL 設定

### 検証項目
- OAuth 認可コード取得
- アクセストークン交換
- プロフィール取得
- 既存ユーザー照合/新規作成

## LINE Messaging API
### 事前準備
- Messaging API チャネル作成
- Webhook URL 設定

### 検証項目
- 送信テスト（Push/Reply）
- 定期配信のジョブ実行
- 失敗時のリトライ
