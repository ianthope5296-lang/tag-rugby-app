# tag-rugby-app — トライさくせんボード

タグラグビーの作戦、振り返りアプリ。小学3年生の体育「かわして つないで トライ！」で、iPadのSafariから使う。

- アプリ：`app/index.html`（ビルドなし。ブラウザで開けば動く。先生メニューの合言葉は試作では `0000`）
- オフライン用：`app/sw.js`（HTTPSか localhost で開いたときに働く）
- コードを書くときの約束：`CLAUDE.md`
- 仕様と進み具合：`docs/`（読む順は `docs/引き継ぎ資料_README.md`）
- 名簿の読み込みの試し：`samples/roster_sample.csv`（架空の名前）
- 紙の教材のデザイン：`design-ref/`（claude.aiのデザイン形式。色・文言・座標の参照用）
- 試作1の元のソース：`prototype/artifact-source.html`（参考）

## 手元で動かす

```sh
cd app && python3 -m http.server 8000
# http://localhost:8000/ を開く
```

## 公開（GitHub Pages）

Settings → Pages → Source を「GitHub Actions」にする。`main` に `app/` の変更が入ると、`app/` だけが公開される。
子どもの名前・作戦・動画は端末のブラウザの中だけに保存され、公開先やリポジトリには入らない。
