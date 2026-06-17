const esbuild = require('esbuild');
const path = require('path');

const watch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: [path.join(__dirname, 'src', 'index.tsx')],
  bundle: true,
  format: 'iife',
  outfile: path.join(__dirname, 'dist', 'mfe-next.js'),
  sourcemap: true,
  minify: false,
  loader: { '.ts': 'ts', '.tsx': 'tsx' },
  platform: 'browser',
  // bundle React into the MFE for a self-contained demo
  external: [],
  absWorkingDir: path.resolve(__dirname, '..', '..'),
  // no footer; lifecycles are exposed inside source explicitly
};

if (watch) {
  buildOptions.watch = {
    onRebuild(error, result) {
      if (error) console.error(' rebuild error', error)
      else console.log('mfe-next rebuilt')
    }
  }
}

esbuild.build(buildOptions).catch(() => process.exit(1));
