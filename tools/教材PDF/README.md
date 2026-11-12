# 教材PDFの作り方

`design-ref/` の紙の教材（claude.ai のデザイン形式）から、印刷用のPDFを作る。

```sh
OUT=$(mktemp -d)
node tools/教材PDF/mkprint.js tools/教材PDF design-ref "$OUT"   # 値を当てはめた印刷用HTMLを作る
node tools/教材PDF/topdf.js "$OUT"/*.html                      # PDFにする（Playwright が必要）
cp "$OUT"/*.pdf docs/配布/教材/
```

- 作戦ボード：A3よこ（原寸）と A4よこ（縮小）
- 作戦カード：A4よこに 2×2（A6よこを93%に縮小、切り取り線つき）。A3の作戦ボードの「ここに さくせんカードを はろう」に入る大きさ
- 学習カード：A4たて
