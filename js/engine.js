// Motorul de joc: date, XP, ranguri, insigne, stele, niveluri, repetiție spațiată (Leitner).
import { incarca, salveaza } from './storage.js';
import { amesteca } from './ui.js';

export const D = { lectii: null, taramuri: [], teste: [], extra: [], harta: null, insigne: [] };

export async function incarcaDate() {
  const f = (p) => fetch(new URL('../' + p, import.meta.url)).then(r => { if (!r.ok) throw new Error(p); return r.json(); });
  const [lectii, teste, extra, harta, insigne] = await Promise.all([
    f('data/lectii.json'), f('data/intrebari_teste.json'), f('data/intrebari_extra.json'), f('data/harta.json'), f('data/insigne.json')]);
  D.lectii = lectii.lectii; D.lectiiIndex = lectii.lectii_index || []; D.taramuri = lectii.taramuri; D.teste = teste; D.extra = extra; D.harta = harta; D.insigne = insigne;
  for (const q of [...teste, ...extra]) q.etichete = etichete(q);
}

export const toateIntrebarile = () => [...D.teste, ...D.extra];
export const active = (lista) => { const dz = new Set(incarca().dezactivate); return lista.filter(q => !dz.has(q.id)); };

// ---------------------------------------------------------------- etichete tematice (pentru insigne)
function etichete(q) {
  const t = JSON.stringify([q.enunt, q.variante, q.raspunsuri_acceptate, q.corecte, q.explicatie_geo, q.sursa]).toLowerCase();
  const e = [];
  if (/vulcan/.test(t)) e.push('vulcanic');
  if (/carst|calcar/.test(t)) e.push('carstic');
  if (/glaciar|ghe[țt]ar/.test(t)) e.push('glaciar');
  if (/sare|s[ăa]rii|diapir/.test(t)) e.push('sare');
  if (/cuest|monoclinal/.test(t)) e.push('cuesta');
  if (/\d{3,4} ?m\b|altitudin|v[âa]rf/.test(t)) e.push('altitudini');
  if (/valea|r[âa]ul|r[âa]u|olt|mure[șs]|jiu|prahova|d[âa]mbovi|barc[ăa]u|timi[șs]|dun[ăa]r|some[șs]/.test(t)) e.push('rauri');
  if (q.tip?.startsWith('harta')) e.push('harta');
  return e;
}

// ---------------------------------------------------------------- ranguri și XP
export const RANGURI = [
  { nume: 'Drumeț', xp: 0, icon: '🥾' }, { nume: 'Cercetaș', xp: 150, icon: '🧭' }, { nume: 'Alpinist', xp: 400, icon: '🧗' },
  { nume: 'Ghid montan', xp: 800, icon: '🎒' }, { nume: 'Cartograf', xp: 1400, icon: '🗺️' }, { nume: 'Maestrul Carpaților', xp: 2200, icon: '👑' }];
export function rang(xp = incarca().xp) {
  let i = RANGURI.length - 1; while (i > 0 && xp < RANGURI[i].xp) i--;
  const urm = RANGURI[i + 1];
  return { ...RANGURI[i], index: i, urmator: urm || null, progres: urm ? (xp - RANGURI[i].xp) / (urm.xp - RANGURI[i].xp) : 1 };
}
export function adaugaXP(n) {
  const s = incarca(); const inainte = rang(s.xp).index;
  s.xp += n; salveaza();
  return rang(s.xp).index > inainte ? rang(s.xp) : null; // rang nou?
}

// ---------------------------------------------------------------- seria zilnică
const azi = () => new Date().toISOString().slice(0, 10);
export function marcheazaZi() {
  const s = incarca(); const z = azi();
  if (s.seria.ultimaZi === z) return s.seria.zile;
  const ieri = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  s.seria.zile = s.seria.ultimaZi === ieri ? s.seria.zile + 1 : 1;
  s.seria.ultimaZi = z; salveaza();
  return s.seria.zile;
}

// ---------------------------------------------------------------- insigne
export function acordaInsigna(id) {
  const s = incarca(); if (s.insigne.includes(id)) return null;
  s.insigne.push(id); salveaza();
  return D.insigne.find(i => i.id === id) || null;
}
/** înregistrează un răspuns și întoarce insignele nou câștigate */
export function inregistreaza(q, corect) {
  const s = incarca(); const c = s.contoare; const noi = [];
  if (corect) for (const e of q.etichete || []) c[e] = (c[e] || 0) + 1;
  if (q.tip?.startsWith('harta')) c.hartaSerie = corect ? (c.hartaSerie || 0) + 1 : 0;
  if (!corect) s.istoricGreseli[q.id] = (s.istoricGreseli[q.id] || 0) + 1;
  salveaza();
  if (corect && q.tip === 'comparare') c.comparare = (c.comparare || 0) + 1;
  const reguli = [['vulcanologul', c.vulcanic >= 5], ['speologul', c.carstic >= 3], ['ghetarul', c.glaciar >= 3], ['sarea-pamantului', c.sare >= 3],
    ['cuesta-perfecta', c.cuesta >= 3], ['varful-moldoveanu', c.altitudini >= 8], ['maestrul-olt', c.rauri >= 10], ['ochi-de-cartograf', c.harta >= 3], ['comparatorul', c.comparare >= 1],
    ['seria-de-foc', s.seria.zile >= 5]];
  for (const [id, ok] of reguli) if (ok) { const i = acordaInsigna(id); if (i) noi.push(i); }
  return noi;
}

// ---------------------------------------------------------------- niveluri
export function intrebariNivel(nivelId) { return active(toateIntrebarile()).filter(q => q.nivel === nivelId); }
export function intrebariTaram(taramId) { return active(toateIntrebarile()).filter(q => q.taram === taramId); }

/** 8–10 întrebări, amestecate, cu cel puțin un exercițiu „interactiv” dacă există */
export function construiesteNivel(nivelId) {
  const pool = intrebariNivel(nivelId);
  const s = incarca();
  // întrebările greșite mai des au prioritate
  const ord = amesteca(pool).sort((a, b) => (s.istoricGreseli[b.id] || 0) - (s.istoricGreseli[a.id] || 0));
  const alese = ord.slice(0, Math.min(10, Math.max(8, ord.length)));
  return amesteca(alese);
}

export function stele(procent) { return procent >= .9 ? 3 : procent >= .7 ? 2 : procent >= .5 ? 1 : 0; }
export function salveazaStele(nivelId, n) {
  const s = incarca(); const noi = [];
  if (!(s.stele[nivelId] >= n)) s.stele[nivelId] = n;
  salveaza();
  if (Object.keys(s.stele).length >= 1) { const i = acordaInsigna('primul-pas'); if (i) noi.push(i); }
  if (n === 3) { const i = acordaInsigna('trei-stele'); if (i) noi.push(i); }
  const toate = D.taramuri.flatMap(t => t.niveluri.map(n => n.id));
  if (toate.every(id => s.stele[id] >= 1)) { const i = acordaInsigna('cartograful-complet'); if (i) noi.push(i); }
  return noi;
}
export function progresTaram(t) {
  const s = incarca(); const max = t.niveluri.length * 3;
  const are = t.niveluri.reduce((a, n) => a + (s.stele[n.id] || 0), 0);
  return { are, max, procent: are / max };
}
export function bossDeblocat() {
  const s = incarca(); if (s.bossDeblocat) return true;
  let are = 0, max = 0; for (const t of D.taramuri) { const p = progresTaram(t); are += p.are; max += p.max; }
  return max > 0 && are / max >= .6;
}

// ---------------------------------------------------------------- flashcard-uri + Leitner (5 cutii)
const INTERVAL = [0, 1, 2, 4, 7]; // zile până la următoarea repetare, pe cutie
export function carduri() {
  const out = [];
  for (const q of active(toateIntrebarile())) {
    let fata = null, verso = null;
    if (q.tip === 'grila' || q.tip === 'harta_numar') { fata = q.enunt; verso = q.variante[q.corect]; }
    else if (q.tip === 'completare') { fata = q.enunt; verso = q.raspunsuri_acceptate[0]; }
    else if (q.tip === 'adevarat_fals') { fata = 'Adevărat sau fals? ' + q.enunt; verso = (q.adevarat ? 'Adevărat. ' : 'Fals. ') + q.explicatie_geo; }
    else if (q.tip === 'cine_sunt') { fata = 'Cine sunt eu? ' + q.indicii.join(' '); verso = q.raspuns; }
    if (fata) out.push({ id: q.id, taram: q.taram, fata, verso, sursa: q.sursa });
  }
  return out;
}
export function carduriScadente(taram = null, max = 20) {
  const s = incarca(); const acum = Date.now();
  const lista = carduri().filter(c => !taram || c.taram === taram);
  const scadente = lista.filter(c => { const l = s.leitner[c.id]; return !l || l.scadent <= acum; });
  scadente.sort((a, b) => (s.leitner[a.id]?.cutie || 0) - (s.leitner[b.id]?.cutie || 0));
  return amesteca(scadente.slice(0, max * 2)).slice(0, max);
}
export function raspunsCard(id, stiut) {
  const s = incarca(); const l = s.leitner[id] || { cutie: 1 };
  l.cutie = stiut ? Math.min(5, l.cutie + 1) : 1;
  l.scadent = Date.now() + INTERVAL[l.cutie - 1] * 864e5;
  s.leitner[id] = l; salveaza();
  const in5 = Object.values(s.leitner).filter(x => x.cutie === 5).length;
  return in5 >= 10 ? acordaInsigna('memorie-de-bufnita') : null;
}
export function statisticaLeitner() {
  const s = incarca(); const c = [0, 0, 0, 0, 0];
  for (const v of Object.values(s.leitner)) c[v.cutie - 1]++;
  return c;
}
