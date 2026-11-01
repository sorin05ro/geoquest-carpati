// Modul Profesor (PIN local): banca de întrebări, greșeli frecvente, export/import, calibrarea hărții.
import { incarca, salveaza, exporta, importa, reseteaza } from './storage.js';
import { h, geoSpune, toast, modal } from './ui.js';
import * as E from './engine.js';
import { creeaza, NUME_TIP } from './exercises.js';
import { harta } from './harta.js';

let deblocat = false;
const hashPin = async (p) => {
  try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('gq-carpati:' + p)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
  catch (e) { return 'p:' + p; }
};

export function ecranProfesor(app) {
  const s = incarca();
  app.append(h('nav', { class: 'pesmet' }, h('a', { href: '#/' }, '← Acasă')), h('h1', { class: 'titlu-sectiune' }, '🔐 Modul Profesor'));
  if (!deblocat) {
    const inp = h('input', { class: 'camp', type: 'password', inputmode: 'numeric', maxlength: 8, 'aria-label': 'PIN', autocomplete: 'off' });
    const nou = !s.pin;
    app.append(h('section', { class: 'card' },
      h('p', {}, nou ? 'Setează un PIN (4–8 cifre). Se păstrează doar pe acest dispozitiv.' : 'Introdu PIN-ul profesorului.'),
      h('label', { class: 'eticheta' }, 'PIN', inp),
      h('div', { class: 'rand-butoane' }, h('button', { class: 'btn', onclick: async () => {
        const v = inp.value.trim(); if (!/^\d{4,8}$/.test(v)) { toast('PIN-ul are 4–8 cifre.'); return; }
        const hp = await hashPin(v);
        if (nou) { s.pin = hp; salveaza(); deblocat = true; toast('PIN salvat.', 'ok'); }
        else if (hp === s.pin) deblocat = true; else { toast('PIN greșit.'); return; }
        app.replaceChildren(); ecranProfesor(app);
      } }, nou ? 'Setează PIN' : 'Intră'))));
    setTimeout(() => inp.focus(), 0);
    return;
  }
  const taburi = [['intrebari', '📚 Întrebări'], ['greseli', '📉 Greșeli frecvente'], ['date', '💾 Date și progres'], ['calibrare', '🗺️ Calibrare hartă']];
  const zona = h('div'); let activ = 'intrebari';
  const bar = h('div', { class: 'taburi', role: 'tablist' }, taburi.map(([id, t]) => h('button', { role: 'tab', 'aria-selected': String(id === activ), onclick: (e) => { activ = id; bar.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b === e.currentTarget))); desen(); } }, t)));
  app.append(bar, zona);
  const desen = () => zona.replaceChildren(({ intrebari: tabIntrebari, greseli: tabGreseli, date: tabDate, calibrare: tabCalibrare })[activ]());
  desen();
}

function tabIntrebari() {
  const s = incarca(); const dz = new Set(s.dezactivate);
  let filtru = '', taram = '';
  const lista = h('div', { class: 'lista-prof' });
  const toate = E.toateIntrebarile();
  const desen = () => {
    const f = toate.filter(q => (!taram || q.taram === taram) && (!filtru || JSON.stringify(q).toLowerCase().includes(filtru)));
    lista.replaceChildren(h('p', { class: 'mic' }, `${f.length} întrebări afișate · ${toate.length - dz.size} active din ${toate.length}`),
      ...f.map(q => h('div', { class: 'rand-prof' + (dz.has(q.id) ? ' inactiv' : '') },
        h('label', {}, h('input', { type: 'checkbox', checked: !dz.has(q.id), 'aria-label': 'Activă', onchange: (e) => { if (e.target.checked) dz.delete(q.id); else dz.add(q.id); s.dezactivate = [...dz]; salveaza(); e.target.closest('.rand-prof').classList.toggle('inactiv', !e.target.checked); } })),
        h('span', { class: 'id' }, q.id), h('span', { class: 'tip' }, NUME_TIP[q.tip]),
        h('span', { class: 'txt' }, q.enunt), h('button', { class: 'mini', onclick: () => modal(h('div', {}, h('h3', {}, q.enunt), creeaza(q, {}).solutie(), h('p', { class: 'mic' }, 'Sursa: ', q.sursa), h('p', { class: 'mic' }, 'Nivel: ', q.nivel, ' · Origine: ', q.origine)), { titlu: q.id }) }, 'Vezi'))));
  };
  desen();
  return h('section', { class: 'card' },
    h('div', { class: 'filtre' }, h('input', { class: 'camp', placeholder: 'Caută…', 'aria-label': 'Caută', oninput: (e) => { filtru = e.target.value.toLowerCase(); desen(); } }),
      h('select', { class: 'camp', 'aria-label': 'Tărâm', onchange: (e) => { taram = e.target.value; desen(); } }, h('option', { value: '' }, 'Ambele teste'), E.D.taramuri.map(t => h('option', { value: t.id }, t.nume)))),
    lista);
}

function tabGreseli() {
  const s = incarca(); const top = Object.entries(s.istoricGreseli).sort((a, b) => b[1] - a[1]).slice(0, 15);
  const toate = E.toateIntrebarile();
  return h('section', { class: 'card' }, geoSpune('Greșelile înregistrate pe acest dispozitiv (de exemplu, tabla din clasă).', 'gandeste'),
    top.length ? h('ol', { class: 'lista-greseli' }, top.map(([id, n]) => { const q = toate.find(x => x.id === id); return h('li', {}, h('strong', {}, `${n}×`), ' ', q ? q.enunt : id, h('small', {}, ` (${id})`)); })) : h('p', {}, 'Încă nu există greșeli înregistrate.'));
}

function descarca(nume, text) {
  const a = h('a', { href: URL.createObjectURL(new Blob([text], { type: 'application/json' })), download: nume }); document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function tabDate() {
  const s = incarca();
  const fis = h('input', { type: 'file', accept: 'application/json,.json', 'aria-label': 'Fișier de progres', onchange: async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { importa(await f.text()); toast('Progres importat.', 'ok'); } catch (err) { toast(err.message || 'Fișier invalid.'); }
  } });
  return h('section', { class: 'card setari' },
    h('label', { class: 'comutator' }, h('input', { type: 'checkbox', checked: !!s.bossDeblocat, onchange: (e) => { s.bossDeblocat = e.target.checked; salveaza(); } }), h('span', {}, h('strong', {}, 'Deblochează Marea Expediție'), h('small', {}, 'Elevii pot da testele simulate fără să fi strâns 60% din stele.'))),
    h('div', { class: 'rand-butoane stanga' },
      h('button', { class: 'btn sec', onclick: () => descarca(`progres-${s.porecla || 'elev'}.json`, exporta()) }, '⬇ Exportă progresul'),
      h('label', { class: 'btn sec' }, '⬆ Importă progresul', fis),
      h('button', { class: 'btn sec', onclick: () => descarca('intrebari-geoquest-carpati.json', JSON.stringify({ teste: E.D.teste, extra: E.D.extra }, null, 1)) }, '⬇ Exportă banca de întrebări')),
    h('p', { class: 'mic' }, 'Pentru a modifica întrebările permanent: editează fișierele data/intrebari_teste.json și data/intrebari_extra.json din repository (vezi README).'),
    h('div', { class: 'rand-butoane stanga' }, h('button', { class: 'btn pericol', onclick: () => { if (confirm('Ștergi tot progresul de pe acest dispozitiv? (PIN-ul rămâne)')) { reseteaza(true); toast('Progres resetat.', 'ok'); location.hash = '#/'; } } }, '🗑 Resetează progresul')));
}

function tabCalibrare() {
  let nr = 1; let puncte = [];
  const out = h('textarea', { class: 'camp cod', rows: 5, readonly: true, 'aria-label': 'Rezultat calibrare' });
  const sel = h('select', { class: 'camp', 'aria-label': 'Regiunea', onchange: (e) => { nr = +e.target.value; puncte = []; actual(); } }, E.D.harta.regiuni.filter(r => r.activ).map(r => h('option', { value: r.nr }, `${r.nr}. ${r.nume}`)));
  const m = harta({ interactiv: false });
  const NS = 'http://www.w3.org/2000/svg';
  const poly = document.createElementNS(NS, 'polyline'); poly.setAttribute('class', 'calibrare');
  m.svg.append(poly);
  m.svg.style.pointerEvents = 'auto';
  m.svg.addEventListener('click', (e) => {
    const pt = m.svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(m.svg.getScreenCTM().inverse());
    puncte.push([Math.round(p.x), Math.round(p.y)]); actual();
  });
  function actual() {
    poly.setAttribute('points', puncte.map(p => p.join(',')).join(' '));
    m.svg.querySelectorAll('.regiune').forEach(g => g.classList.toggle('evidentiata', +g.dataset.nr === nr));
    out.value = JSON.stringify({ nr, poligon: puncte });
  }
  actual();
  return h('section', { class: 'card' },
    geoSpune('Alege regiunea, apoi dă clic pe hartă de-a lungul conturului. Copiază rezultatul în data/harta.json (câmpul „poligoane” al regiunii).', 'gandeste'),
    h('div', { class: 'filtre' }, sel, h('button', { class: 'btn sec', onclick: () => { puncte.pop(); actual(); } }, '↶ Anulează punctul'), h('button', { class: 'btn sec', onclick: () => { puncte = []; actual(); } }, 'Golește')),
    m, out, h('button', { class: 'btn', onclick: () => { try { navigator.clipboard.writeText(out.value); toast('Copiat.', 'ok'); } catch (e) { out.select(); } } }, 'Copiază'));
}
