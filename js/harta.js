// Harta numerotată: imaginea + un strat SVG cu poligoanele regiunilor 1–15.
import { D } from './engine.js';
import { h } from './ui.js';

const NS = 'http://www.w3.org/2000/svg';
const pct = (p) => p.map(([x, y]) => `${x},${y}`).join(' ');

/**
 * @param {object} o
 *  - onAlege(nr, ev): apelat la atingerea unei regiuni active (null dacă s-a atins în afara lor)
 *  - evidentiaza: [{nr, eticheta}] regiuni colorate cu o etichetă (A, B, ...)
 *  - ascundeNumere: acoperă numerele tipărite pe hartă (pentru „Atinge X” — altfel ar fi prea ușor? nu: numerele rămân, e hartă de lucru)
 */
export function harta({ onAlege = null, evidentiaza = [], interactiv = true, clasa = '' } = {}) {
  const H = D.harta;
  const cutie = h('div', { class: `harta ${clasa}` });
  const img = h('picture', {},
    h('source', { srcset: H.imagine, type: 'image/webp' }),
    h('img', { src: H.imagine_png, alt: 'Harta unităților de relief ale României, cu numere de la 1 la 40', width: H.latime, height: H.inaltime, draggable: 'false' }));
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${H.latime} ${H.inaltime}`);
  svg.setAttribute('class', 'harta-strat');
  svg.setAttribute('role', interactiv ? 'group' : 'img');
  svg.setAttribute('aria-label', 'Regiuni ale hărții');
  const ev = new Map(evidentiaza.map(e => [e.nr, e.eticheta]));
  for (const r of H.regiuni.filter(r => r.activ)) {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'regiune' + (ev.has(r.nr) ? ' evidentiata' : ''));
    g.dataset.nr = r.nr;
    for (const p of r.poligoane) {
      const poly = document.createElementNS(NS, 'polygon');
      poly.setAttribute('points', pct(p));
      g.append(poly);
    }
    if (interactiv && onAlege) {
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', `Regiunea cu numărul ${r.nr}`);
      g.addEventListener('click', (e) => { e.stopPropagation(); onAlege(r.nr, e); });
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAlege(r.nr, e); } });
    }
    svg.append(g);
  }
  // etichete (A, B, C, D) peste regiunile evidențiate
  for (const [nr, et] of ev) {
    if (!et) continue;
    const r = H.regiuni.find(x => x.nr === nr); if (!r) continue;
    const c = centruMare(r.poligoane);
    const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'eticheta-litera');
    const cerc = document.createElementNS(NS, 'circle'); cerc.setAttribute('cx', c[0]); cerc.setAttribute('cy', c[1]); cerc.setAttribute('r', 42);
    const t = document.createElementNS(NS, 'text'); t.setAttribute('x', c[0]); t.setAttribute('y', c[1] + 17); t.textContent = et;
    g.append(cerc, t); svg.append(g);
  }
  if (interactiv && onAlege) svg.addEventListener('click', (e) => onAlege(null, e));
  cutie.append(img, svg);
  cutie.marcheaza = (nr, cls) => svg.querySelector(`g.regiune[data-nr="${nr}"]`)?.classList.add(cls);
  cutie.svg = svg;
  return cutie;
}

function centruMare(poligoane) {
  // centrul celui mai mare poligon (media vârfurilor, suficient pentru o etichetă)
  let best = poligoane[0], arie = 0;
  for (const p of poligoane) {
    let a = 0; for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; a += x1 * y2 - x2 * y1; }
    if (Math.abs(a) > arie) { arie = Math.abs(a); best = p; }
  }
  const sx = best.reduce((s, p) => s + p[0], 0) / best.length, sy = best.reduce((s, p) => s + p[1], 0) / best.length;
  return [sx, sy];
}

export const numeRegiune = (nr) => D.harta.regiuni.find(r => r.nr === nr)?.nume || `regiunea ${nr}`;
