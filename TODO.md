## リリース系
 - codepushのコマンドを使えるようにデプロイ用のサーバーに移す

## 細かいやつ
 - ログインフォーム系の共通化
 - apikeyのフォーム共通化
 - 通知の設定
 - 課金画面でのデフォルトプランABテスト
 - 一度電話番号を登録すると削除ができない, よって２段階認証を解除できない
   - クーポンの本人確認でこれを報酬手段にしてるので
   - 電話番号は別に二段階認証の拒否オプションを用意する事でクーポンの本人確認と２段階認証の責務を分ける？
 - toastメッセージをグローバルなコンポーネントにする
   - reasonがある場合は全てその中で分岐 onpressなどの中でメッセージ切り替えるのはなかなかつらい

 - [android] keyboard aware
 - [android] requireでのimageがきかない？

## 追加対応系
- アプリユーザーにslack招待のオプション
- Tooltipのナビゲーション：react-native-popup-menu/api.md at master · instea/react-native-popup-menu https://github.com/instea/react-native-popup-menu/blob/master/doc/api.md
- [ ] アプリでのカスタムパラメータ対応（this.props.forms.filter(f => f.required).map(f => this.allocateForm(f))}）をthis.props.forms.map(f => this.allocateForm(f))}に
 - [ ] 上におなじくconst source_params = this.props.bot_detail.strategy.source_params.filter(p => p.requireed)のフィル外す
- detailの画面で取引所と通貨追加
- load_activate_processのプラン変更導線追加
- 退会申請の階層を深くする