// Rulează testele automate și capturile de ecran cu Playwright.
//   python3 -m http.server 8765   (în rădăcina proiectului)
//   node tests/ruleaza.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BAZA = process.env.BAZA || 'http://localhost:8765/';
const DIR = new URL('./screenshots/', import.meta.url).pathname;

const b = await chromium.launch();
let esec = 0;
{ // teste de date + barem
  const p = await b.newPage();
  await p.goto(BAZA + 'tests/teste.html');
  await p.waitForFunction(() => window.__rezultat, null, { timeout: 20000 });
  const r = await p.evaluate(() => window.__rezultat);
  for (const x of r) { console.log(`${x.ok ? '✓' : '✗'} ${x.nume}${x.info ? ' — ' + x.info : ''}`); if (!x.ok) esec++; }
  await p.close();
}
// capturi la 375 / 768 / 1920 px + verificare scroll orizontal
const stare = { porecla: 'Test', avatar: '🦊', xp: 420, insigne: ['primul-pas', 'trei-stele', 'ochi-de-cartograf'], stele: { t1s1: 3, t1s2: 2, t2s1: 1 }, seria: { ultimaZi: new Date().toISOString().slice(0, 10), zile: 3 }, bossDeblocat: true, setari: { sunet: false, cronometru: true, textMare: false } };
const ecrane = [['acasa', '#/'], ['taram', '#/taram/t1'], ['nivel', '#/nivel/t1s3'], ['lectii', '#/lectii'], ['invata', '#/invata/dct'], ['flash', '#/flash'], ['expeditie', '#/expeditie/1'], ['profil', '#/profil'], ['clasa', '#/clasa']];
for (const w of [375, 768, 1920]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w === 1920 ? 1080 : w === 768 ? 1024 : 812 } });
  await ctx.addInitScript((s) => { try { localStorage.setItem('geoquest-carpati-v1', JSON.stringify(s)); } catch (e) {} }, stare);
  const p = await ctx.newPage();
  const erori = []; p.on('pageerror', e => erori.push(e.message));
  for (const [nume, h] of ecrane) {
    await p.goto(BAZA + h); await p.waitForTimeout(700);
    const lat = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (lat > 1) { console.log(`✗ scroll orizontal ${lat}px: ${nume} @${w}`); esec++; }
    await p.screenshot({ path: `${DIR}${w}-${nume}.png`, fullPage: nume !== 'expeditie' });
  }
  if (erori.length) { console.log(`✗ erori JS @${w}: ${erori.join(' | ')}`); esec++; } else console.log(`✓ fără erori JS și fără scroll orizontal @${w}px`);
  await ctx.close();
}
await b.close();
console.log(esec ? `\n${esec} probleme` : '\nToate verificările au trecut.');
process.exit(esec ? 1 : 0);
