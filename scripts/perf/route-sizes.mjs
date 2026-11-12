// Mede o JS de primeira carga por rota (equivalente ao antigo "First Load JS"
// do `next build`, que o Turbopack não imprime mais).
// Uso: node scripts/perf/route-sizes.mjs <saida.md>
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { gzipSync } from "node:zlib";
import vm from "node:vm";

const APPS = ["apps/web", "apps/transacoes"];
const out = process.argv[2];

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p, acc);
    } else if (name === "page_client-reference-manifest.js") {
      acc.push(p);
    }
  }
  return acc;
}

function sizes(nextDir, files) {
  let raw = 0;
  let gz = 0;
  for (const f of files) {
    const buf = readFileSync(join(nextDir, f));
    raw += buf.length;
    gz += gzipSync(buf, { level: 9 }).length;
  }
  return { raw, gz };
}

const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
const lines = ["| App | Rota | JS (raw) | JS (gzip) | Chunks |", "|---|---|---:|---:|---:|"];

for (const app of APPS) {
  const nextDir = join(app, ".next");
  if (!existsSync(nextDir)) {
    console.error(`${app}: sem .next — rode o build antes`);
    continue;
  }
  const root = JSON.parse(readFileSync(join(nextDir, "build-manifest.json"), "utf8"));
  const appDir = join(nextDir, "server", "app");

  for (const manifestPath of walk(appDir).sort()) {
    const ctx = { globalThis: {} };
    vm.runInNewContext(readFileSync(manifestPath, "utf8"), ctx);
    const [[pageKey, manifest]] = Object.entries(ctx.globalThis.__RSC_MANIFEST);
    if (pageKey.includes("_not-found") || pageKey.includes("_global-error")) {
      continue;
    }

    // Chunks do root + de todos os layouts/página da rota
    const files = new Set(root.rootMainFiles);
    for (const chunks of Object.values(manifest.entryJSFiles ?? {})) {
      for (const c of chunks) {
        files.add(c);
      }
    }
    const route = pageKey.replace(/\/page$/, "").replace(/\/\([^)]+\)/g, "") || "/";
    const { raw, gz } = sizes(nextDir, [...files]);
    lines.push(
      `| ${app.split("/")[1]} | \`${route || "/"}\` | ${kb(raw)} | ${kb(gz)} | ${files.size} |`,
    );
  }

  // Tamanho total de todos os chunks estáticos (inclui chunks lazy)
  const chunkDir = join(nextDir, "static", "chunks");
  const all = readdirSync(chunkDir)
    .filter((f) => f.endsWith(".js"))
    .map((f) => relative(nextDir, join(chunkDir, f)).split(sep).join("/"));
  const total = sizes(nextDir, all);
  lines.push(
    `| ${app.split("/")[1]} | _todos os chunks_ | ${kb(total.raw)} | ${kb(total.gz)} | ${all.length} |`,
  );
}

const md = lines.join("\n");
console.log(md);
if (out) {
  writeFileSync(out, `${md}\n`);
}
