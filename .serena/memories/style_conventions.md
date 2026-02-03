# コードスタイル・規約

## TypeScript
- `strict: true` 必須
- `ESNext` ターゲット
- `bundler` モジュール解決

## 命名規則
- **ファイル**: kebab-case (`fortune-content.ts`)
- **変数/関数**: camelCase (`getUserById`)
- **型/クラス**: PascalCase (`FortuneContent`)
- **定数**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **DB カラム**: snake_case (`created_at`)

## コンポーネント
- 関数コンポーネント + hooks 優先
- `'use client'` / `'use server'` ディレクティブ明示
- Props は interface で定義

## 状態管理
- グローバル状態: Jotai atom
- サーバー状態: Server Components / Server Actions

## バリデーション
- Zod スキーマで入力検証
- `packages/domain` に共有スキーマを定義

## インポート順序
1. React / Next.js
2. 外部パッケージ
3. 内部パッケージ (`@hoshino/*`)
4. 相対インポート

## CSS
- Tailwind CSS 4
- shadcn/ui コンポーネント
- `cn()` ユーティリティでクラス結合
