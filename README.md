# renofa-parking-web

["レノファ山口 FC ホームゲームの運営をもっと効率的に"](https://digitech-ymg.org/project)の取り組み

## 技術概要

- Nextjs（React フレームワーク）
- Chakra UI（CSS）
- TypeScript（型導入）
- Prettier（コードの整形）
- ESLint（構文チェック）
- husky（Git 操作自動制約）

## 依存関係

以下のいずれかの前提環境が必要

- Node.js v14.x
- yarn v1.x

または、

- docker-compose v2.x
- make v3.x

※Node.js の LTS が 16 に移行したため、近々 16 ベースに移行

## 開発環境構築

以下のいずれかの方法で環境構築を行う

### 方法 1

- 以下のコマンドをターミナルで実行

```
$ git clone git@github.com:digitech-ymg/renofa-parking-web.git
$ yarn
$ yarn dev
```

### 方法 2

- 以下のコマンドをターミナルで実行

```
$ git clone git@github.com:digitech-ymg/renofa-parking-web.git
$ make i
$ make up
```

## ブランチ運用（検討中）

[Gitflow ワークフロー](https://www.atlassian.com/ja/git/tutorials/comparing-workflows/gitflow-workflow)に準じて運用する
