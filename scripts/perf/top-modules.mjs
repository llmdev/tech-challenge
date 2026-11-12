// Lista os maiores pacotes no bundle client a partir do relatório do bundle-analyzer.
// Uso: node scripts/perf/top-modules.mjs <client.html> [n]
import { readFileSync } from "node:fs";
const [file, n = "15"] = process.argv.slice(2);
const html = readFileSync(file, "utf8");
const m = html.match(/window\.chartData\s*=\s*(\[.*?\]);\s*window\./s);
const data = JSON.parse(m[1]);
const pkgs = new Map();
function visit(node) {
  if (node.groups) {
    return node.groups.forEach(visit);
  }
  const p = node.path ?? node.label ?? "";
  const mm = p.match(/node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?((?:@[^/]+\/)?[^/]+)/);
  const key = mm
    ? mm[1]
    : p.includes("packages/")
      ? `@repo/${p.split("packages/")[1].split("/")[0]}`
      : "(app)";
  const cur = pkgs.get(key) ?? { parsed: 0, gzip: 0 };
  cur.parsed += node.parsedSize ?? 0;
  cur.gzip += node.gzipSize ?? 0;
  pkgs.set(key, cur);
}
data.forEach(visit);
console.log("| Pacote | parsed | gzip |\n|---|---:|---:|");
const top = [...pkgs].sort((a, b) => b[1].gzip - a[1].gzip).slice(0, Number(n));
for (const [k, v] of top) {
  console.log(`| ${k} | ${(v.parsed / 1024).toFixed(1)} kB | ${(v.gzip / 1024).toFixed(1)} kB |`);
}
