// claude.ai デザイン形式（.dc.html）を、値を当てはめた ふつうのHTMLに する
const fs = require('fs');
function render(file, idSuffix) {
  const src = fs.readFileSync(file, 'utf8');
  const body = src.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1].replace(/<helmet>[\s\S]*?<\/helmet>/, '');
  const m = src.match(/<script type="text\/x-dc"[^>]*data-props='([^']*)'>([\s\S]*?)<\/script>/);
  const props = {}; const meta = JSON.parse(m[1]);
  for (const k in meta) if (k[0] !== '$' && 'default' in meta[k]) props[k] = meta[k].default;
  const Component = new Function('DCLogic', m[2] + '\nreturn Component;')(class { constructor(p){ this.props = p; } });
  const vals = new Component(props).renderVals();
  const get = (o, path) => path.split('.').reduce((a, k) => a == null ? a : a[k], o);
  let html = body.replace(/<sc-for list="\{\{([\w.]+)\}\}" as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g, (_, list, as, inner) =>
    get(vals, list).map(item => inner.replace(new RegExp('\\{\\{' + as + '\\.([\\w.]+)\\}\\}', 'g'), (_, k) => String(get(item, k)))).join(''));
  html = html.replace(/\{\{([\w.]+)\}\}/g, (_, k) => { const v = get(vals, k); if (v === undefined) throw new Error(file + ': ' + k); return String(v); });
  if (idSuffix) html = html.replace(/id="([\w-]+)"/g, `id="$1${idSuffix}"`).replace(/url\(#([\w-]+)\)/g, `url(#$1${idSuffix})`);
  return { html, w: meta.$preview.width, h: meta.$preview.height, title: (src.match(/<title>(.*?)<\/title>/) || [])[1] };
}
module.exports = render;
