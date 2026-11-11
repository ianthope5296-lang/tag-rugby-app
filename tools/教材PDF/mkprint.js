const fs = require('fs'); const render = require(process.argv[2] + '/dcrender.js');
const REF = process.argv[3], OUT = process.argv[4];
const HEAD = `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&display=swap">
<style>*{box-sizing:border-box} body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.sheet{position:relative;overflow:hidden;break-after:page}.sheet:last-child{break-after:auto}
.fit{position:absolute;left:50%;top:50%;transform-origin:center}
.cut{position:absolute;border:0 dashed #9aa39c}
.note{position:absolute;font:11px 'BIZ UDPGothic',sans-serif;color:#7a837c}
</style>`;
const mm = v => v * 96 / 25.4;
function page(size, wmm, hmm, inner){ return `<div class="sheet" style="width:${wmm}mm;height:${hmm}mm">${inner}</div>`; }
function fitOne(d, wmm, hmm, marginMm){ const s = Math.min((mm(wmm)-2*mm(marginMm))/d.w, (mm(hmm)-2*mm(marginMm))/d.h);
  return `<div style="position:absolute;left:${((mm(wmm)-d.w*s)/2).toFixed(1)}px;top:${((mm(hmm)-d.h*s)/2).toFixed(1)}px;width:${d.w}px;height:${d.h}px;zoom:${s.toFixed(4)}">${d.html}</div>`; }
function doc(name, size, wmm, hmm, pages){
  fs.writeFileSync(`${OUT}/${name}.html`, HEAD + `<title>${name}</title><style>@page{size:${size};margin:0}</style></head><body>` + pages.join('') + '</body></html>');
}
// 作戦ボード：A3よこ（原寸）と A4よこ（縮小）
const board = render(`${REF}/Board.dc.html`);
doc('作戦ボード_A3', 'A3 landscape', 420, 297, [page('A3', 420, 297, fitOne(board, 420, 297, 6))]);
doc('作戦ボード_A4', 'A4 landscape', 297, 210, [page('A4', 297, 210, fitOne(board, 297, 210, 6))]);
// 学習カード：A4たて
const main = render(`${REF}/Main.dc.html`);
doc('学習カード_A4', 'A4 portrait', 210, 297, [page('A4', 210, 297, fitOne(main, 210, 297, 6))]);
// 作戦カード5まい：A4よこに 2×2（切り取り線つき）
const cards = [1,2,3,4,5].map(n => render(`${REF}/Card${n}.dc.html`, '-c' + n));
const cw = 148*0.93, ch = 105*0.93; // A6よこ を 93%
function cardPage(list, label){
  const gx = (297 - 2*cw) / 3, gy = (210 - 2*ch) / 3; let s = '';
  list.forEach((c, i) => { const x = gx + (i%2)*(cw+gx), y = gy + Math.floor(i/2)*(ch+gy), k = mm(cw)/c.w;
    s += `<div style="position:absolute;left:${x}mm;top:${y}mm;width:${cw}mm;height:${ch}mm"><div style="width:${c.w}px;height:${c.h}px;zoom:${k.toFixed(4)}">${c.html}</div></div>`; });
  s += `<div class="cut" style="left:148.5mm;top:4mm;bottom:4mm;border-left-width:1px"></div><div class="cut" style="top:105mm;left:4mm;right:4mm;border-top-width:1px"></div>`;
  s += `<div class="note" style="right:6mm;bottom:2mm">✂ 点線で 切る　${label}</div>`;
  return page('A4', 297, 210, s);
}
doc('作戦カード_A4', 'A4 landscape', 297, 210, [cardPage(cards.slice(0,4), '作戦カード 1〜4'), cardPage(cards.slice(4), '作戦カード 5')]);
console.log('ok', board.title, main.title, cards.map(c => c.title).join(','));
