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

事前準備を経て、以下のいずれかの方法で環境構築を行う

### 事前準備

Firebase Local Emulator を使います。

[公式ドキュメントに従って必要な環境を構築してください。](https://firebase.google.com/docs/emulator-suite/install_and_configure?hl=ja&authuser=0)

起動コマンド(他のコマンドは別 Terminal から実行してください)

```shell
yarn emu:start
```

エミュレータの UI が用意されています。

<http://localhost:4000/>

エミュレータの追加データを残したい（次回再利用したい）場合は出力してください。

```shell
yarn emu:export
```

### 方法 1

- 以下のコマンドをターミナルで実行

```shell
git clone git@github.com:digitech-ymg/renofa-parking-web.git
yarn
yarn dev
```

### 方法 2

- 以下のコマンドをターミナルで実行

```shell
git clone git@github.com:digitech-ymg/renofa-parking-web.git
make i
make up
```

### VSCode をエディターとして利用している方へ

開発時に推奨する拡張機能を本リポジトリにて共有しているので、インストールする（方法はこのページを[参照](https://qiita.com/Glavis/items/c3dac07e4bcf5c50db0a#%E8%A8%AD%E5%AE%9A%E3%81%97%E3%81%9F%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%99%E3%82%8B)）

## ブランチ運用（検討中）

[Gitflow ワークフロー](https://www.atlassian.com/ja/git/tutorials/comparing-workflows/gitflow-workflow)に準じて運用する

## コミットメッセージ（検討中）

[gitmoji](https://gitmoji.dev/)に準じて絵文字 prefix をつけたコミットメッセージを書くことを推奨（[cli](https://github.com/carloscuesta/gitmoji)もある）
