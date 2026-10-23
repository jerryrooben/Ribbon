// Builds the www/ folder: wraps the page in a full HTML document and bundles PDF.js and fonts so the app works offline.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
const nm = path.join(root, 'node_modules');

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });

let html = fs.readFileSync(path.join(root, 'www-src', 'index.html'), 'utf8');

// PDF.js (legacy build runs on older Android WebViews)
const pj = path.join(nm, 'pdfjs-dist', 'legacy', 'build');
fs.copyFileSync(path.join(pj, 'pdf.min.js'), path.join(www, 'pdf.min.js'));
fs.copyFileSync(path.join(pj, 'pdf.worker.min.js'), path.join(www, 'pdf.worker.min.js'));
html = html
  .split('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js').join('pdf.worker.min.js')
  .split('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js').join('pdf.min.js');

// Fonts: bundle locally; if anything is missing, keep the online fonts as a fallback.
try {
  const wanted = {
    'newsreader': ['400', '500', '600', '400-italic'],
    'bodoni-moda': ['500', '700'],
    'ibm-plex-mono': ['400', '500']
  };
  const fontsDir = path.join(www, 'fonts');
  fs.mkdirSync(fontsDir, { recursive: true });
  let css = '';
  for (const [pkg, weights] of Object.entries(wanted)) {
    const base = path.join(nm, '@fontsource', pkg);
    const outFiles = path.join(fontsDir, pkg, 'files');
    fs.mkdirSync(outFiles, { recursive: true });
    for (const w of weights) {
      let c = fs.readFileSync(path.join(base, 'latin-' + w + '.css'), 'utf8');
      const names = new Set();
      c.replace(/url\(\.\/files\/([^)]+)\)/g, (m, f) => { names.add(f); return m; });
      names.forEach(f => fs.copyFileSync(path.join(base, 'files', f), path.join(outFiles, f)));
      css += c.split('./files/').join(pkg + '/files/') + '\n';
    }
  }
  fs.writeFileSync(path.join(fontsDir, 'fonts.css'), css);
  const withLocal = html
    .replace(/<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>\s*/g, '')
    .replace('<script src="pdf.min.js"></script>', '<link rel="stylesheet" href="fonts/fonts.css">\n<script src="pdf.min.js"></script>');
  html = withLocal;
  console.log('Fonts bundled.');
} catch (e) {
  console.log('Fonts not bundled, using online fonts:', e.message);
}

const head = '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
  '<style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style>';
fs.writeFileSync(path.join(www, 'index.html'), head + html + '\n</html>\n');
console.log('www ready.');
