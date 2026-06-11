#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
    const res = path.join(dir, e.name);
    if (e.isDirectory()) walk(res, fileList);
    else if (e.isFile() && e.name === 'tsconfig.json') fileList.push(res);
  }
  return fileList;
}

const root = process.cwd();
const configs = [path.join(root, 'tsconfig.base.json')];
configs.push(...walk(root));

console.log('Running tsc --noEmit for', configs.length, 'configs');
let failed = false;
for (const cfg of configs) {
  console.log('\n==== tsc -p', cfg, '====');
  const res = spawnSync('pnpm', ['exec', 'tsc', '-p', cfg, '--noEmit'], { stdio: 'inherit' });
  if (res.status !== 0) failed = true;
}

process.exit(failed ? 1 : 0);
