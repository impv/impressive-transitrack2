# TransiTrack 2

## 概要

TransiTrackのリニューアル版 - 交通費の申請と管理を効率化するWebアプリケーション


## 機能

### 基本機能

- **Google認証によるログイン**: Google OAuth 2.0を使用した社内ドメイン限定のログイン機能。ログイン時にメンバー情報を自動登録・更新します
- **交通費の申請**: 日付・出発駅・到着駅・金額・交通手段（電車/バス）・片道/往復を指定して交通費を申請できます。往復の場合はトランザクション内で2件のレコードを自動作成します
- **交通費の一覧表示**: 月別フィルタで申請済みの交通費を一覧表示します。管理者は全メンバーの申請を閲覧できます
- **交通費の編集・削除**: 自分が申請した交通費の内容を編集・削除できます（他のメンバーの申請は操作不可）
- **申請サマリーの表示**: 選択した月の交通費合計を表示します。管理者はメンバーごとの合計金額を一覧で確認できます
- **CSV出力**: 交通費サマリーをCSVファイルとしてダウンロードできます。管理者は全メンバー分のサマリーを出力可能です

### 追加機能

- **お気に入り経路登録**: よく使う経路を事前に登録しておくことで、交通費申請時にワンタップで入力を自動補完できます


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

## ディレクトリ構成

主要なディレクトリ構成は以下の通りです。

```txt
src/
├── components/              # 共通UIコンポーネント
│   └── elements/            # Button / Card / Header / Input / Toast など最小単位
│
├── features/                # 機能単位のモジュール
│   └── expenses/            # 交通費・お気に入り経路機能
│       ├── apiClient.ts                     # 交通費 API 呼び出し
│       ├── favoriteRoutesApiClient.ts       # お気に入り経路 API 呼び出し
│       ├── components/                      # 機能専用コンポーネント
│       │   ├── ExpenseForm/                 # 交通費申請フォーム
│       │   ├── ExpensesList/                # 交通費申請一覧
│       │   ├── FavoriteRouteManagement/     # お気に入り経路管理
│       │   └── SummaryExpenses/             # 申請内容サマリー
│       ├── hooks/                           # 機能専用カスタムフック
│       └── utils/                           # 機能専用ユーティリティ関数
│
├── hooks/                   # グローバルなカスタムフック
│
├── lib/                     # 共通ライブラリ
│   ├── prisma.ts            # Prismaクライアント（シングルトン）
│   ├── validation.ts        # バリデーション関数
│   └── db/
│       └── member.ts        # メンバーupsert処理
│
├── pages/                   # ルーティング（Pages Router）
│   ├── api/                 # API Routes（サーバー側処理）
│   │   ├── auth/            # Google認証の設定
│   │   ├── expenses/        # 交通費のサーバー側処理
│   │   └── favorite-routes/ # お気に入り経路のサーバー側処理
│   ├── auth/                # 認証関連ページ
│   └── dashboard/           # トップページ
│
├── server/                  # サーバー側ビジネスロジック（リポジトリ層）
│   ├── expenses/repository.ts       # 交通費のDB操作
│   └── favoriteRoutes/repository.ts # お気に入り経路のDB操作
│
├── styles/                  # グローバルCSS
└── types/                   # 共通型定義
```

## サーバー側の処理フロー

### 全体構成

```
React コンポーネント (hooks)
  ↓ 関数呼び出し
apiClient (src/features/**/apiClient.ts)  ← fetch() のラッパー・エラーハンドリング
  ↓ fetch()
API Routes (src/pages/api/)               ← リクエスト受付・バリデーション・認可
  ↓
Repository (src/server/)                  ← Prisma を使った DB 操作
  ↓
PostgreSQL (Prisma)
```

Next.js の Pages Router における API Routes がサーバー側の処理を担当しています。
各 API Route は「認証チェック → バリデーション → リポジトリ呼び出し → レスポンス」という一貫した流れで処理されます。

### apiClient（クライアント側 API 呼び出し層）

コンポーネントや hooks から直接 `fetch()` を呼ぶのではなく、`apiClient.ts` を経由して API にアクセスします。
これにより、エンドポイントの URL・HTTP メソッド・エラーハンドリングが一箇所にまとまります。

| ファイル | 提供する関数 | 対応する API |
|----------|-------------|-------------|
| `src/features/expenses/apiClient.ts` | `createExpense()`, `getExpenses()`, `updateExpense()`, `deleteExpense()` | `/api/expenses` |
| `src/features/expenses/favoriteRoutesApiClient.ts` | `getFavoriteRoutes()`, `createFavoriteRoute()`, `updateFavoriteRoute()`, `deleteFavoriteRoute()` | `/api/favorite-routes` |

---

### 認証 (NextAuth)

**ファイル:** `src/pages/api/auth/[...nextauth].ts`

Google OAuth 2.0 によるログインを提供します。

```
ユーザー → Googleログイン → NextAuth コールバック
  1. プロフィールを Zod でバリデーション
  2. メールのドメインが COMPANY_DOMAIN と一致するか確認
  3. upsertMemberByEmail() で Member テーブルに登録/更新
  4. JWT に userId・isAdmin を格納
  5. セッションに userId・isAdmin を反映
```

**関連ファイル:**
| ファイル | 役割 |
|----------|------|
| `src/pages/api/auth/[...nextauth].ts` | NextAuth 設定・コールバック |
| `src/lib/db/member.ts` | `upsertMemberByEmail()` - ログイン時のメンバー登録 |
| `src/lib/prisma.ts` | Prisma クライアント（pg アダプター + SSL + シングルトン） |
| `src/types/next-auth.d.ts` | Session に `id`・`isAdmin` を追加する型拡張 |

---

### 交通費 API

#### `GET /api/expenses`

交通費一覧を取得します。

```
リクエスト → 認証チェック
  → yearMonth クエリパラメータのバリデーション (YYYY-MM)
  → isAdmin ?
      → true:  getAllExpenses()       （全メンバーの申請 + メンバー情報）
      → false: getExpensesByMemberId() （自分の申請のみ）
  → 200 レスポンス
```

#### `POST /api/expenses`

交通費を申請します。

```
リクエスト → 認証チェック
  → バリデーション（日付・駅名・金額・交通手段・片道往復）
  → timezoneOffset を使って未来日チェック
  → createExpense()
      → tripType === "ROUNDTRIP" の場合
          トランザクション内で2件作成（行き + 帰り）
      → tripType === "ONEWAY" の場合
          1件作成
  → 201 レスポンス
```

#### `PUT /api/expenses/[id]`

交通費を更新します。

```
リクエスト → 認証チェック
  → getExpenseById() で取得
  → 所有者チェック（自分の申請でなければ 403）
  → バリデーション
  → updateExpenseById()
  → 200 レスポンス
```

#### `DELETE /api/expenses/[id]`

交通費を削除します。

```
リクエスト → 認証チェック
  → getExpenseById() で取得
  → 所有者チェック
  → deleteExpenseById()
  → 204 レスポンス
```

**関連ファイル:**
| ファイル | 役割 |
|----------|------|
| `src/pages/api/expenses/index.ts` | GET（一覧）・POST（作成） |
| `src/pages/api/expenses/[id].ts` | GET（詳細）・PUT（更新）・DELETE（削除） |
| `src/server/expenses/repository.ts` | DB 操作（CRUD + 往復トランザクション） |
| `src/types/expenses.ts` | Expense / ExpenseRecord / ExpenseInput 型定義 |

---

### お気に入り経路 API

#### `GET /api/favorite-routes`

自分のお気に入り経路一覧を取得します。

```
リクエスト → 認証チェック
  → getFavoriteRoutesByMemberId()
  → 200 レスポンス
```

#### `POST /api/favorite-routes`

お気に入り経路を登録します。

```
リクエスト → 認証チェック
  → バリデーション（駅名・金額・交通手段・片道往復）
  → createFavoriteRoute()
  → 201 レスポンス
```

#### `PUT /api/favorite-routes/[id]`

お気に入り経路を更新します。

```
リクエスト → 認証チェック
  → getFavoriteRouteById() で取得
  → 所有者チェック
  → バリデーション
  → updateFavoriteRouteById()
  → 200 レスポンス
```

#### `DELETE /api/favorite-routes/[id]`

お気に入り経路を削除します。

```
リクエスト → 認証チェック
  → getFavoriteRouteById() で取得
  → 所有者チェック
  → deleteFavoriteRouteById()
  → 204 レスポンス
```

**関連ファイル:**
| ファイル | 役割 |
|----------|------|
| `src/pages/api/favorite-routes/index.ts` | GET（一覧）・POST（作成） |
| `src/pages/api/favorite-routes/[id].ts` | PUT（更新）・DELETE（削除） |
| `src/server/favoriteRoutes/repository.ts` | DB 操作（CRUD） |
| `src/types/favoriteRoutes.ts` | FavoriteRoute / FavoriteRouteInput 型定義 |

---

### データベース (Prisma)

**ファイル:** `prisma/schema.prisma`

```
Member ──┬── 1:N ──→ Expense
         └── 1:N ──→ FavoriteRoute
```

| モデル | 主なフィールド | 備考 |
|--------|---------------|------|
| **Member** | id, name, email, isAdmin | ログイン時に upsert |
| **Expense** | memberId, date, departure, arrival, amount, transport, tripType | 日付は UTC 保存 |
| **FavoriteRoute** | memberId, name, departure, arrival, amount, transport, tripType | name は任意 |

**Enum:**
- `TransportType`: TRAIN / BUS
- `TripType`: ONEWAY / ROUNDTRIP