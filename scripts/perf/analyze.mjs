// Build de produção + medições de bundle para os apps web e transacoes.
//   1. `next build` (Turbopack, o build real) → JS de primeira carga por rota
//   2. `next build --webpack` com ANALYZE=true → treemaps do bundle-analyzer + top pacotes
// Ao final, refaz o build Turbopack para deixar o .next pronto para `perf:lighthouse`.
// Uso: node scripts/perf/analyze.mjs <baseline|after>
import { execSync } from "node:child_process";
import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const label = process.argv[2] ?? "after";
const outDir = join("perf", label);
const APPS = ["web", "transacoes"];
mkdirSync(outDir, { recursive: true });

const run = (cmd, env = {}) => execSync(cmd, { stdio: "inherit", env: { ...process.env, ...env } });
const capture = (cmd) => execSync(cmd, { encoding: "utf8" });
const build = (app, extra = "", env = {}) =>
  run(`pnpm --filter=tech-challenge-${app} exec next build ${extra}`, env);

// 1. Analyzer (webpack)
for (const app of APPS) {
  build(app, "--webpack", { ANALYZE: "true" });
  const dest = join(outDir, "analyze", app);
  mkdirSync(dest, { recursive: true });
  cpSync(join("apps", app, ".next", "analyze"), dest, { recursive: true });
  writeFileSync(
    join(outDir, `top-modules-${app}.md`),
    capture(`node scripts/perf/top-modules.mjs ${join(dest, "client.html")} 20`),
  );
}

// 2. Build real (Turbopack) + tamanho por rota
for (const app of APPS) {
  build(app);
}
run(`node scripts/perf/route-sizes.mjs ${join(outDir, "route-sizes.md")}`);
