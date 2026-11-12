// Roda Lighthouse CI contra os builds de produção de web (3000) e transacoes (3001)
// autenticado com um usuário de teste, e gera perf/<label>/lighthouse.md.
//
// Pré-requisitos: Postgres no ar (docker compose up -d), tabelas criadas e
// `pnpm perf:build` executado.
// Uso: node scripts/perf/lighthouse.mjs <baseline|after>
import { spawn, execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const label = process.argv[2] ?? "after";
const WEB = "http://localhost:3000";
const TX = "http://localhost:3001";
const USER = { name: "Perf Test", email: "perf@example.local", password: "PerfTest12345!" };
const SEED_COUNT = 60;
const RUNS = 3;
const URLS = [`${WEB}/login`, `${WEB}/`, `${WEB}/graficos`, `${TX}/transacoes`];
const outDir = join("perf", label);
mkdirSync(outDir, { recursive: true });

const children = [];
function start(app, port) {
  const child = spawn(`pnpm --filter=tech-challenge-${app} exec next start -p ${port}`, {
    shell: true,
    stdio: "ignore",
    env: { ...process.env, RDS_SSL: "false" },
  });
  children.push(child);
}
function stopAll() {
  for (const c of children) {
    try {
      if (process.platform === "win32") {
        execSync(`taskkill /pid ${c.pid} /T /F`, { stdio: "ignore" });
      } else {
        c.kill("SIGTERM");
      }
    } catch {}
  }
}
process.on("exit", stopAll);
process.on("SIGINT", () => process.exit(130));

async function waitFor(url, timeoutMs = 60_000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    try {
      await fetch(url, { redirect: "manual" });
      return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Timeout esperando ${url}`);
}

async function login() {
  const headers = { "content-type": "application/json", origin: WEB };
  await fetch(`${WEB}/api/auth/sign-up/email`, {
    method: "POST",
    headers,
    body: JSON.stringify(USER),
  });
  const res = await fetch(`${WEB}/api/auth/sign-in/email`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email: USER.email, password: USER.password }),
  });
  if (!res.ok) {
    throw new Error(`Login falhou: ${res.status} ${await res.text()}`);
  }
  return res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
}

async function seed(cookie) {
  const headers = { cookie, "content-type": "application/json", origin: WEB };
  const res = await fetch(`${WEB}/api/transacoes?page=1&pageSize=1`, { headers });
  if (!res.ok) {
    throw new Error(`GET /api/transacoes falhou: ${res.status}`);
  }
  const { total } = await res.json();
  const categories = ["pix", "conta", "salario", "compras", "alimentacao", "transporte", "outros"];
  const institutions = ["Banco A", "Banco B", "Corretora C", "Carteira"];
  for (let i = total; i < SEED_COUNT; i++) {
    const d = new Date(2026, 5 + Math.floor(i / 12), (i % 28) + 1);
    const date = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    const credit = i % 4 === 0;
    await fetch(`${WEB}/api/transacoes`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        type: credit ? "credit" : "debit",
        category: credit ? "salario" : categories[i % categories.length],
        description: `${credit ? "Recebimento" : "Pagamento"} #${i + 1}`,
        institution: institutions[i % institutions.length],
        date,
        // formato da API: "R$ 1.234,56" (o "." é separador de milhar)
        amount: `R$ ${(credit ? 3000 + i * 10 : 20 + i * 7.5).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      }),
    });
  }
  console.log(
    `Seed: ${Math.max(0, SEED_COUNT - total)} transações criadas (total >= ${SEED_COUNT}).`,
  );
}

function lhci(args) {
  execSync(`pnpm exec lhci ${args}`, { stdio: "inherit" });
}

function summarize(dir) {
  const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));
  const rows = [];
  for (const run of manifest.filter((r) => r.isRepresentativeRun)) {
    const lhr = JSON.parse(readFileSync(run.jsonPath, "utf8"));
    const a = lhr.audits;
    const ms = (id) => `${Math.round(a[id].numericValue)} ms`;
    const jsBytes =
      a["resource-summary"]?.details?.items?.find((i) => i.resourceType === "script")
        ?.transferSize ?? 0;
    const totalBytes = a["total-byte-weight"].numericValue;
    rows.push(
      `| \`${new URL(lhr.finalDisplayedUrl).host}${new URL(lhr.finalDisplayedUrl).pathname}\` | ${Math.round(lhr.categories.performance.score * 100)} | ${ms("first-contentful-paint")} | ${ms("largest-contentful-paint")} | ${ms("total-blocking-time")} | ${a["cumulative-layout-shift"].numericValue.toFixed(3)} | ${ms("speed-index")} | ${(jsBytes / 1024).toFixed(1)} kB | ${(totalBytes / 1024).toFixed(1)} kB |`,
    );
  }
  return [
    "| URL | Score | FCP | LCP | TBT | CLS | SI | JS transferido | Total transferido |",
    "|---|---:|---:|---:|---:|---:|---:|---:|---:|",
    ...rows,
  ].join("\n");
}

try {
  for (const app of ["web", "transacoes"]) {
    if (!existsSync(`apps/${app}/.next/BUILD_ID`)) {
      throw new Error(`apps/${app} sem build — rode pnpm perf:build`);
    }
  }
  start("web", 3000);
  start("transacoes", 3001);
  await waitFor(`${WEB}/login`);
  await waitFor(`${TX}/transacoes`);

  const cookie = await login();
  await seed(cookie);

  const sections = [
    `# Lighthouse — ${label}`,
    "",
    `Mediana de ${RUNS} execuções por URL (run representativa do LHCI).`,
    "",
  ];
  for (const preset of ["mobile", "desktop"]) {
    const rc = join(tmpdir(), `lhci-${preset}.json`); // contém o cookie: fora do repo
    writeFileSync(
      rc,
      JSON.stringify({
        ci: {
          collect: {
            url: URLS,
            numberOfRuns: RUNS,
            settings: {
              ...(preset === "desktop" ? { preset: "desktop" } : {}),
              extraHeaders: { Cookie: cookie },
              onlyCategories: ["performance"],
            },
          },
        },
      }),
    );
    const resultsDir = join(outDir, "lighthouse", preset);
    rmSync(".lighthouseci", { recursive: true, force: true });
    rmSync(resultsDir, { recursive: true, force: true });
    lhci(`collect --config=${rc}`);
    lhci(`upload --config=${rc} --target=filesystem --outputDir=${resultsDir}`);
    rmSync(rc, { force: true });
    sections.push(`## ${preset}`, "", summarize(resultsDir), "");
  }

  const md = sections.join("\n");
  writeFileSync(join(outDir, "lighthouse.md"), md);
  console.log(`\n${md}`);
} finally {
  stopAll();
}
