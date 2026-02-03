# DB 設計（詳細）

## 方針
- Stripe を正とし、状態は Webhook 同期
- 論理削除は必要に応じて `deletedAt` を追加
- 監査目的で `createdAt`/`updatedAt` を全テーブルに持たせる

## テーブル一覧
### users
- id (PK)
- email (unique)
- name
- role (user/admin)
- status (active/suspended)
- ... (other auth fields)


### line_notifications (任意)
- id (uuid)
- user_id (fk)
- message_type
- payload
- sent_at
- created_at

## 主なリレーション
- users 1:N purchases
- users 1:1 subscriptions
- fortune_tellers 1:N fortune_contents
- fortune_contents 1:N purchases

## インデックス方針
- users.email, users.line_user_id
- purchases.user_id, purchases.content_id
- subscriptions.user_id, subscriptions.status
- fortune_contents.teller_id, fortune_contents.is_public

## メモ
- LINE Login のみのユーザーは email を null 許容
- Stripe Webhook は idempotency key で冪等化
