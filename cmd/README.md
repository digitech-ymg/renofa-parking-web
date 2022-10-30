# renofa-parking-web command

## setup

require [direnv](https://github.com/direnv/direnv), and prepare `.env` file to refer admin json.

```.env
GOOGLE_APPLICATION_CREDENTIALS=./renofa-parking-dev.json
```

require [nodejs](https://nodejs.org/ja/) 18 or upper, and install modules.

```shell
npm i
```

## useage

```shell
# 投稿情報CSVを全て取得
npx ts-node src/get-all-posts.ts

# 投稿情報CSVを試合IDで取得
npx ts-node src/get-posts.ts 20220428

# 試合情報の作成/更新（対話形式）
npx ts-node src/create-game.ts
npx ts-node src/update-game.ts

# 認証ユーザーの全削除
npx ts-node src/delete-auth-users.ts
```
