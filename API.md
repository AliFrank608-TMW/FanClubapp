FORMAT: 1A
HOST: http://cointrader.co.jp

# cointrader向けのAPI
エンドユーザーが管理するbotに関係のAPIです。

# Bot
## ボットのに関するAPI [/bots]
botの作成と一覧取得

### Botの一覧取得 [GET]
本の基本情報を取得します。

+ Parameters

+ Response 200 (application/json)
    + Attribute
      + total: 1 - 全体件数（将来的にはこの数を変更）
      + lists: (array, required, fixed-type) - アカウントのbot一覧
          + bot: (object, required)
              + id: (number, required)
              + bottom: (number, required) - bot停止の底値
              + top: (number, required) - bot停止の上限値
              + range: (number, required) - 売買のしきい値を、開始時点からX円上下する毎にずらしてその幅を超えるタイミングで売買
              + inital_price: (number, required) - 設定時の価格
              + current_price: (number, required) - 今の価格
              + status: (number, required) - 稼働中かどうか
              + investment_yield: (number, required) - 期待利回り
              + investment_amount: (number, required) - bot運用額

### 新規Botの登録 [POST]
BOTの基本情報を登録します。  
createUserした後、Botを追加する場合に呼び出す。  
課金額に応じたフィルタリングを行う事。
botのtopとbottomをnullableにしてもいいけど、  
そうするとalertしないといけず管理大変なので後回し。

+ Request
    + Attribute
        + token: `XXXXXXXXXXXXXXXXXXX` (string, required) - access_token
        + bottom: (number, required) - bot停止の底値
        + top: (number, required) - bot停止の上限値
        + range: (number, required) - 売買のしきい値を、開始時点からX円上下する毎にずらしてその幅を超えるタイミングで売買
        + investment_amount: (number, required) - 運用額登録

+ Response 200 (application/json)
    + Attribute
        + created: `true` (boolean, required) - 作成の成否


## 個別Botに関するAPI [/bots/:id]
botの作成と一覧取得

### Botの個別情報取得 [GET]
Botの個別情報を設定します

+ Request
    + Attribute
        + token: `XXXXXXXXXXXXXXXXXXX` (string, required) - access_token
        + id: `1` (number, required) - BotのID

+ Response 200 (application/json)
    + Attribute
      + id: (number, required)
      + bottom: (number, required) - bot停止の底値
      + top: (number, required) - bot停止の上限値
      + range: (number, required) - 売買のしきい値を、開始時点からX円上下する毎にずらしてその幅を超えるタイミングで売買
      + inital_price: (number, required) - 設定時の価格
      + current_price: (number, required) - 今の価格
      + status: (number, required) - 稼働中かどうか
      + investment_yield: (number, required) - 期待利回り
      + investment_amount: (number, required) - bot運用額


### Botの個別情報更新 [PUT]
個別Botの設定を更新します

+ Request
    + Attribute
      + token: `XXXXXXXXXXXXXXXXXXX` (string, required) - access_token
      + bottom: (number, required) - bot停止の底値
      + top: (number, required) - bot停止の上限値
      + range: (number, required) - 売買のしきい値を、開始時点からX円上下する毎にずらしてその幅を超えるタイミングで売買
      + investment_amount: (number, required) - 運用額登録
      + status: (number, nullable) - あればステータスだけ更新して他のparamsはムシ

+ Response 200 (application/json)
    + Attribute
        + updated: `true` (boolean, required) - 更新の成否

# Payment
## bot利用の課金 [/payments]
最初は1ユーザー1つの制限のみにして、初月無料のパターンでここの実装はなしでもOK。

### 新規課金の作成 [POST]
未課金の状態のユーザーに課金を作成する

+ Request
    + Attribute
      + token: `XXXXXXXXXXXXXXXXXXX` (string, required) - access_token

+ Response 200 (application/json)
    + Attribute
        + created: `true` (boolean, required) - 作成の成否


### 現在の課金にキャンセルフラグを立てる [PUT]
キャンセル処理、user.payments.lastをキャンセル状態にする。

+ Request
    + Attribute
      + token: `XXXXXXXXXXXXXXXXXXX` (string, required) - access_token
      + status: (string, required) - キャンセル

+ Response 200 (application/json)
    + Attribute
        + updated: `true` (boolean, required) - 更新の成否

# User
## Userの認証情報更新 [/users/:id/]
userの認証情報更新

### 基本情報更新 [PUT]
個別Botの設定を更新します

+ Request
    + Attribute
      + token: `XXXXXXXXXXXXXXXXXXX` (string, required) - access_token
      + email: (string, required) - bot停止の底値
      + phone_num: (string, required) - bot停止の上限値

+ Response 200 (application/json)
    + Attribute
        + updated: `true` (boolean, required) - 更新の成否


※API blueprintのフォーマットです
