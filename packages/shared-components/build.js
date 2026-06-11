const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const src = path.join(__dirname, 'src', 'index.tsx');
const outDir = path.join(__dirname, 'dist');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

esbuild.build({
  entryPoints: [src],
  bundle: true,
  format: 'esm',
  outfile: path.join(outDir, 'index.js'),
  sourcemap: true,
  minify: false,
  loader: { '.ts': 'ts', '.tsx': 'tsx' },
  platform: 'browser',
  external: ['react', 'react-dom']
}).catch(() => process.exit(1));
