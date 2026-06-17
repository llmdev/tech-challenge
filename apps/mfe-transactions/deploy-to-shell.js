const fs = require('fs');
const path = require('path');

const distFile = path.join(__dirname, 'dist', 'mfe-transactions.js');
const mapFile = path.join(__dirname, 'dist', 'mfe-transactions.js.map');
const destDir = path.join(__dirname, '..', 'shell', 'vendor');
const destFile = path.join(destDir, 'mfe-transactions.js');
const destMap = path.join(destDir, 'mfe-transactions.js.map');

if (!fs.existsSync(distFile)) {
  console.error('Build not found:', distFile);
  process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(distFile, destFile);
console.log('Copied', distFile, '->', destFile);
if (fs.existsSync(mapFile)) {
  fs.copyFileSync(mapFile, destMap);
  console.log('Copied', mapFile, '->', destMap);
}

console.log('Deployed mfe-transactions bundle to shell vendor directory.');
