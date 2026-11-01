// Marea Expediție: simularea Testului nr. 1 / nr. 2, cu punctaj după barem și notă.
import { incarca, salveaza } from './storage.js';
import { h, geoSpune, geoSvg, toast, confetti, sunet, modal } from './ui.js';
import * as E from './engine.js';
import { creeaza } from './exercises.js';
import { antet } from './app.js';

const SUBIECTE = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const CERINTE = {
  I: 'Încercuiți litera corespunzătoare răspunsului corect.', II: 'Completați spațiile punctate cu răspunsul corect.',
  III: 'Realizați corespondența între coloana A și coloana B.', IV: 'Harta: unități de relief marcate cu litere.',
  V: 'Comparați relieful celor două unități.', VI: 'Depresiunea Colinară a Transilvaniei.'
};

export function ecranAlegereExpeditie(app) {
  const deblocat = E.bossDeblocat(); const s = incarca();
  app.append(h('nav', { class: 'pesmet' }, h('a', { href: '#/' }, '← Harta tărâmurilor')),
    h('h1', { class: 'titlu-sectiune' }, '🏆 Marea Expediție'),
    deblocat ? geoSpune('Aici sunt exact întrebările din testele tale. Punctajul se calculează după barem: 90 de puncte + 10 din oficiu.', 'bucuros')
      : geoSpune('Expediția se deschide când ai strâns 60% din stelele celor două teste (sau când o deschide profesorul).', 'gandeste'),
    h('div', { class: 'taramuri' }, [1, 2].map(n => {
      const r = s.expeditii?.[n];
      return h(deblocat ? 'a' : 'div', { class: 'taram boss' + (deblocat ? '' : ' blocat'), href: deblocat ? `#/expeditie/${n}` : null, style: { '--c': '#12355b' } },
        h('span', { class: 'icon' }, deblocat ? (n === 1 ? '🥾' : '🧗') : '🔒'), h('strong', {}, `Testul nr. ${n}`),
        h('span', { class: 'mic' }, 'Carpații Românești și Depresiunea Colinară a Transilvaniei · 50 de minute'),
        r ? h('span', { class: 'mic' }, `Cel mai bun rezultat: nota ${r.nota.toFixed(2)}`) : null);
    })));
}

export function ecranExpeditie(app, n) {
  if (!E.bossDeblocat()) { location.hash = '#/expeditie'; return; }
  const s = incarca();
  const itemi = E.D.teste.filter(q => q.test === n).sort((a, b) => SUBIECTE.indexOf(a.subiect) - SUBIECTE.indexOf(b.subiect));
  const ctrl = itemi.map(q => creeaza(q, {}));
  let poz = 0, terminat = false, ramas = 50 * 60, timer = null;
  const ceas = h('span', { class: 'ceas', 'aria-live': 'off' });
  const zona = h('div');
  const nav = h('div', { class: 'nav-exp' });
  app.append(h('nav', { class: 'pesmet' }, h('a', { href: '#/expeditie', onclick: (e) => { if (!terminat && !confirm('Ieși din expediție? Răspunsurile se pierd.')) e.preventDefault(); } }, '← Ieși')),
    h('header', { class: 'cap-exp' }, h('h1', {}, `Testul nr. ${n}`), s.setari.cronometru ? ceas : null), nav, zona);

  const tic = () => { if (terminat) return; ramas--; ceas.textContent = `⏱ ${String(Math.floor(ramas / 60)).padStart(2, '0')}:${String(ramas % 60).padStart(2, '0')}`; ceas.classList.toggle('putin', ramas < 300); if (ramas <= 0) { toast('Timpul a expirat!'); preda(); } };
  if (s.setari.cronometru) { tic(); timer = setInterval(tic, 1000); }
  const opreste = () => { clearInterval(timer); window.removeEventListener('hashchange', opreste); };
  window.addEventListener('hashchange', opreste);

  function desenNav() {
    nav.replaceChildren(...itemi.map((q, i) => h('button', { class: 'pas' + (i === poz ? ' curent' : '') + (ctrl[i].citeste() !== null ? ' facut' : ''), type: 'button', 'aria-label': `Itemul ${i + 1}, subiectul ${q.subiect}`, onclick: () => { poz = i; desen(); } }, `${q.subiect}${itemi.filter((x, k) => x.subiect === q.subiect && k <= i).length > 1 || itemi.filter(x => x.subiect === q.subiect).length > 1 ? '.' + itemi.filter((x, k) => x.subiect === q.subiect && k <= i).length : ''}`)));
  }
  function desen() {
    const q = itemi[poz]; const c = ctrl[poz];
    const primul = itemi.findIndex(x => x.subiect === q.subiect) === poz;
    const punctajSubiect = itemi.filter(x => x.subiect === q.subiect).reduce((a, x) => a + x.puncte, 0);
    zona.replaceChildren(h('div', { class: 'card intrebare' },
      h('div', { class: 'meta-q' }, h('span', { class: 'eticheta-tip' }, `SUBIECTUL ${q.subiect} · ${punctajSubiect} puncte`), h('span', { class: 'eticheta-test' }, `${q.puncte}p`)),
      primul ? h('p', { class: 'instr' }, CERINTE[q.subiect]) : null,
      q.tip === 'completare' ? null : h('h2', { class: 'enunt' }, q.enunt), c.el,
      h('div', { class: 'rand-butoane' },
        h('button', { class: 'btn sec', disabled: poz === 0, onclick: () => { poz--; desen(); } }, '← Înapoi'),
        poz < itemi.length - 1 ? h('button', { class: 'btn', onclick: () => { poz++; desen(); } }, 'Următorul →')
          : h('button', { class: 'btn', onclick: () => confirmaPredare() }, '📤 Predă testul'))));
    desenNav();
    // reafișarea păstrează starea controllerului (elementul e același)
    if (!c.el.dataset.asc) { c.el.dataset.asc = '1'; for (const ev of ['click', 'change', 'input']) c.el.addEventListener(ev, () => setTimeout(desenNav, 0)); }
  }
  function confirmaPredare() {
    const lipsa = ctrl.filter(c => c.citeste() === null).length;
    if (lipsa && !confirm(`Ai ${lipsa} itemi fără răspuns complet. Predai oricum?`)) return;
    preda();
  }
  function preda() {
    if (terminat) return; terminat = true; opreste();
    const rez = itemi.map((q, i) => { const st = ctrl[i].citeste(); const fr = st === null ? 0 : ctrl[i].evalueaza(st); return { q, st, fr, p: Math.round(q.puncte * fr * 100) / 100 }; });
    const pe = Object.fromEntries(SUBIECTE.map(sb => [sb, { obt: 0, max: 0 }]));
    for (const r of rez) { pe[r.q.subiect].obt += r.p; pe[r.q.subiect].max += r.q.puncte; }
    const total = rez.reduce((a, r) => a + r.p, 0) + 10;
    const nota = total / 10;
    const st = incarca(); st.expeditii = st.expeditii || {};
    if (!st.expeditii[n] || st.expeditii[n].nota < nota) st.expeditii[n] = { nota, total, data: new Date().toISOString().slice(0, 10) };
    salveaza();
    E.adaugaXP(Math.round(total)); E.marcheazaZi();
    rez.forEach(r => { if (r.fr < 1) E.raspunsCard(r.q.id, false); E.inregistreaza(r.q, r.fr >= .999); });
    const ins = nota >= 9 ? E.acordaInsigna('expeditia-' + n) : null;
    if (nota >= 9) confetti(80); sunet(nota >= 5 ? 'nivel' : 'gresit');
    antet();
    const gresite = rez.filter(r => r.fr < 1);
    zona.replaceChildren(h('section', { class: 'card final raport' },
      h('div', { class: 'geo-mare', html: geoSvg(nota >= 7 ? 'bucuros' : nota >= 5 ? 'normal' : 'trist', 100) }),
      h('h2', {}, 'Raportul expediției'),
      h('p', { class: 'nota' }, 'Nota: ', h('strong', {}, nota.toFixed(2))),
      h('p', { class: 'mic' }, `${Math.round(total * 100) / 100} puncte din 100 (inclusiv 10 din oficiu) · +${Math.round(total)} XP`),
      ins ? h('div', { class: 'insigna castigata' }, h('span', { class: 'ic' }, ins.icon), h('strong', {}, 'Insignă nouă: ' + ins.nume)) : null,
      h('table', { class: 'tabel-barem' }, h('thead', {}, h('tr', {}, h('th', {}, 'Subiect'), h('th', {}, 'Obținut'), h('th', {}, 'Maxim'))),
        h('tbody', {}, SUBIECTE.map(sb => h('tr', {}, h('td', {}, sb), h('td', {}, String(Math.round(pe[sb].obt * 100) / 100)), h('td', {}, String(pe[sb].max)))),
          h('tr', {}, h('td', {}, 'Oficiu'), h('td', {}, '10'), h('td', {}, '10')),
          h('tr', { class: 'total' }, h('td', {}, 'TOTAL'), h('td', {}, String(Math.round(total * 100) / 100)), h('td', {}, '100')))),
      gresite.length ? h('div', { class: 'gresite' }, h('h3', {}, 'Ce ai greșit – și ce spune Geo'),
        gresite.map(r => h('details', { class: 'item-gresit' }, h('summary', {}, `Subiectul ${r.q.subiect} · ${r.p} / ${r.q.puncte}p · ${r.q.enunt.slice(0, 70)}${r.q.enunt.length > 70 ? '…' : ''}`),
          h('p', {}, creeaza(r.q, {}).solutie()), h('p', { class: 'mic' }, '🦉 ', r.q.explicatie_geo)))) : geoSpune('Niciun punct pierdut. Ești gata de test!', 'bucuros'),
      h('div', { class: 'rand-butoane' },
        gresite.length ? h('button', { class: 'btn', onclick: () => exerseaza(gresite.map(r => r.q)) }, '🎯 Exersează ce ai greșit') : null,
        h('a', { class: 'btn sec', href: '#/expeditie' }, 'Înapoi la expediții'))));
    nav.replaceChildren();
  }
  function exerseaza(lista) {
    let i = 0;
    const pas = () => {
      if (i >= lista.length) { modal(geoSpune('Ai refăcut toți itemii greșiți. Încearcă din nou expediția!', 'bucuros'), { titlu: 'Gata!' }); return; }
      const q = lista[i]; const c = creeaza(q, {}); const fb = h('div');
      const b = h('button', { class: 'btn', onclick: () => {
        if (b.dataset.gata) { i++; close(); pas(); return; }
        const st = c.citeste(); if (st === null) { toast('Răspunde complet.'); return; }
        const fr = c.evalueaza(st); c.marcheaza?.(st);
        fb.replaceChildren(geoSpune(h('span', {}, fr >= .999 ? 'Corect! ' : 'Uite soluția: ', fr >= .999 ? '' : c.solutie(), ' ', q.explicatie_geo), fr >= .999 ? 'bucuros' : 'gandeste'));
        b.textContent = 'Următorul →'; b.dataset.gata = '1';
      } }, 'Verifică');
      const close = modal(h('div', {}, h('h3', { class: 'enunt' }, q.tip === 'completare' ? '' : q.enunt), c.el, fb, h('div', { class: 'rand-butoane' }, b)), { titlu: `Exersare ${i + 1} / ${lista.length}`, inchide: true });
    };
    pas();
  }
  desen();
}
