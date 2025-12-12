# TransiTrack 2

## 概要

TransiTrackのリニューアル版 - 交通費の申請と管理を効率化するWebアプリケーション

## 追加機能（予定）


## 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/) (Pages Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **パッケージマネージャー**: pnpm
- **リンター**: ESLint
- **フォーマッター**: Prettier

（その他の技術スタックは開発の進行に応じて追加予定）

## 開発環境のセットアップ

### 前提条件

- Node.js 18.x以上
- pnpm 8.x以上

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/impv/transitrack2.git
cd transitrack2

# 依存関係のインストール
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

### ビルド

```bash
pnpm build
```

### 本番環境での起動

```bash
pnpm start
```


### 開発スクリプト

```bash
# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start

# ESLintでコードチェック
pnpm lint

# Prettierでコード整形
pnpm format

# 未使用の依存関係をチェック
pnpm knip
```