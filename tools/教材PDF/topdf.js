const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  for (const f of process.argv.slice(2)) {
    await p.goto('file://' + f, {waitUntil:'networkidle'}); await p.evaluate(() => document.fonts.ready);
    const ok = await p.evaluate(() => document.fonts.check('700 20px "BIZ UDPGothic"', 'あ'));
    await p.pdf({path: f.replace(/\.html$/, '.pdf'), preferCSSPageSize: true, printBackground: true});
    console.log(f.split('/').pop(), 'BIZ UD font:', ok);
  } await b.close(); })();
