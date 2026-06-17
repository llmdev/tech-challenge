const Database = require('better-sqlite3');
try {
  const db = new Database('apps/web/auth.db');
  const rows = db.prepare("SELECT name, sql FROM sqlite_master WHERE type='table'").all();
  console.log(JSON.stringify(rows, null, 2));
  db.close();
} catch (e) {
  console.error(e && e.message ? e.message : e);
  process.exit(1);
}
