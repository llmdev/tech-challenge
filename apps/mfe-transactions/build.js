const esbuild = require('esbuild');
const path = require('path');

const watch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: [path.join(__dirname, 'src', 'index.tsx')],
  bundle: true,
  format: 'iife',
  outfile: path.join(__dirname, 'dist', 'mfe-transactions.js'),
  sourcemap: true,
  minify: false,
  loader: { '.ts': 'ts', '.tsx': 'tsx' },
  platform: 'browser',
  external: [],
  absWorkingDir: path.resolve(__dirname, '..', '..'),
};

if (watch) {
  buildOptions.watch = {
    onRebuild(error) {
      if (error) console.error('rebuild error', error);
      else console.log('mfe-transactions rebuilt');
    },
  };
}

esbuild.build(buildOptions).catch(() => process.exit(1));
