// Modul Clasă: concurs pe echipe la tabla interactivă + „Roata norocului”.
import { h, geoSpune, confetti, sunet, toast, amesteca } from './ui.js';
import * as E from './engine.js';
import { creeaza, NUME_TIP } from './exercises.js';
import { aplicaSetari } from './app.js';

const CULORI = ['#d21f3c', '#2b6cb0', '#2d7a3e', '#b7791f'];

export function ecranClasa(app) {
  let nrEchipe = 2, runde = 10, sursa = 'toate';
  const numeEchipe = ['Vulturii', 'Râșii', 'Urșii', 'Caprele negre'];
  const inputs = numeEchipe.map((n, i) => h('input', { class: 'camp', value: n, maxlength: 18, 'aria-label': `Numele echipei ${i + 1}` }));
  const zonaEchipe = h('div', { class: 'echipe-config' });
  const desenEchipe = () => zonaEchipe.replaceChildren(...inputs.slice(0, nrEchipe).map((inp, i) => h('label', { class: 'echipa-cfg', style: { '--c': CULORI[i] } }, h('span', { class: 'punct' }), inp)));
  desenEchipe();
  const alegNr = h('div', { class: 'segment' }, [2, 3, 4].map(n => h('button', { type: 'button', 'aria-pressed': String(n === nrEchipe), onclick: (e) => { nrEchipe = n; e.currentTarget.parentNode.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(+b.textContent === n))); desenEchipe(); } }, n)));
  const sel = h('select', { class: 'camp', onchange: (e) => sursa = e.target.value, 'aria-label': 'Sursa întrebărilor' },
    h('option', { value: 'toate' }, 'Toate tărâmurile'), E.D.taramuri.map(t => h('option', { value: t.id }, t.nume)), h('option', { value: 'teste' }, 'Doar întrebări din teste'), h('option', { value: 'roata' }, '🎡 Roata norocului (la fiecare rundă)'));
  const selRunde = h('select', { class: 'camp', onchange: (e) => runde = +e.target.value, 'aria-label': 'Număr de runde' }, [6, 10, 16, 20].map(n => h('option', { value: n, selected: n === 10 }, `${n} întrebări`)));
  app.append(h('nav', { class: 'pesmet' }, h('a', { href: '#/' }, '← Acasă')), h('h1', { class: 'titlu-sectiune' }, '👥 Mod Clasă'),
    geoSpune('Proiectează pe tablă. Echipele răspund pe rând; răspunsul corect aduce 10 puncte, cel cu indiciu 5.', 'bucuros'),
    h('section', { class: 'card' }, h('p', { class: 'eticheta' }, 'Număr de echipe'), alegNr, zonaEchipe,
      h('label', { class: 'eticheta' }, 'Întrebări din', sel), h('label', { class: 'eticheta' }, 'Lungimea concursului', selRunde),
      h('div', { class: 'rand-butoane' }, h('button', { class: 'btn mare', onclick: () => start() }, 'Începe concursul 🚀'))));

  function pool(src) {
    const toate = E.active(E.toateIntrebarile()).filter(q => !['harta'].includes(q.tip) || true);
    if (src === 'teste') return toate.filter(q => q.origine === 'test');
    if (src === 'toate') return toate;
    return toate.filter(q => q.taram === src);
  }
  function start() {
    const echipe = inputs.slice(0, nrEchipe).map((inp, i) => ({ nume: inp.value.trim() || `Echipa ${i + 1}`, puncte: 0, c: CULORI[i] }));
    document.documentElement.setAttribute('data-proiectie', '');
    let runda = 0; const folosite = new Set();
    const scor = h('div', { class: 'scor-echipe' });
    const zona = h('div');
    app.replaceChildren(h('nav', { class: 'pesmet' }, h('a', { href: '#/clasa', onclick: () => setTimeout(aplicaSetari, 0) }, '← Ieși din concurs')), scor, zona);
    const desenScor = (activ) => scor.replaceChildren(...echipe.map((e, i) => h('div', { class: 'echipa' + (i === activ ? ' activa' : ''), style: { '--c': e.c } }, h('strong', {}, e.nume), h('span', { class: 'pct' }, e.puncte))));
    const runda1 = () => {
      if (runda >= runde) return podium();
      const ech = runda % echipe.length; desenScor(ech);
      if (sursa === 'roata') return roata(ech);
      intrebare(ech, sursa);
    };
    const roata = (ech) => {
      const t = amesteca(E.D.taramuri)[0];
      const disc = h('div', { class: 'roata', 'aria-hidden': 'true' }, E.D.taramuri.map((x, i) => h('span', { style: { '--i': i } }, x.icon)));
      zona.replaceChildren(h('div', { class: 'card centru' }, h('h2', {}, `${echipe[ech].nume} învârte roata!`), disc, h('p', { class: 'rez-roata', 'aria-live': 'polite' }, '…')));
      const idx = E.D.taramuri.indexOf(t);
      requestAnimationFrame(() => disc.style.transform = `rotate(${1440 + (360 - idx * 90)}deg)`);
      setTimeout(() => { zona.querySelector('.rez-roata').textContent = `${t.icon} ${t.nume}`; setTimeout(() => intrebare(ech, t.id), 900); }, 2300);
    };
    const intrebare = (ech, src) => {
      const lista = pool(src).filter(q => !folosite.has(q.id));
      const q = amesteca(lista.length ? lista : pool(src))[0]; folosite.add(q.id);
      const c = creeaza(q, {}); let indiciu = false;
      const fb = h('div', { 'aria-live': 'polite' });
      const bInd = h('button', { class: 'btn sec', onclick: () => { const m = c.indiciu?.(); if (m) { indiciu = true; fb.replaceChildren(geoSpune(m, 'gandeste')); bInd.disabled = true; } } }, '🦉 Indiciu (5 puncte)');
      const bVer = h('button', { class: 'btn', onclick: () => {
        if (bVer.dataset.gata) { runda++; runda1(); return; }
        const st = c.citeste(); if (st === null) { toast('Răspundeți complet.'); return; }
        const fr = c.evalueaza(st); c.marcheaza?.(st); const ok = fr >= .999;
        const p = ok ? (indiciu ? 5 : 10) : fr >= .5 ? 3 : 0; echipe[ech].puncte += p; desenScor(ech);
        sunet(ok ? 'corect' : 'gresit'); if (ok) confetti(20);
        fb.replaceChildren(geoSpune(h('span', {}, h('strong', {}, ok ? `Corect! +${p} puncte pentru ${echipe[ech].nume}. ` : p ? `Parțial: +${p} puncte. ` : 'Greșit. '), ok ? '' : c.solutie(), ' ', q.explicatie_geo), ok ? 'bucuros' : 'gandeste'));
        bVer.textContent = runda + 1 >= runde ? 'Vezi clasamentul 🏆' : 'Următoarea echipă →'; bVer.dataset.gata = '1'; bInd.disabled = true;
      } }, 'Verifică');
      zona.replaceChildren(h('div', { class: 'card intrebare' },
        h('div', { class: 'meta-q' }, h('span', { class: 'eticheta-tip' }, `Runda ${runda + 1} / ${runde} · ${NUME_TIP[q.tip]}`), h('span', { class: 'eticheta-test', style: { background: echipe[ech].c, color: '#fff' } }, `Răspunde: ${echipe[ech].nume}`)),
        q.tip === 'completare' ? null : h('h2', { class: 'enunt' }, q.enunt), c.el, fb, h('div', { class: 'rand-butoane' }, bInd, bVer)));
    };
    const podium = () => {
      const ord = [...echipe].sort((a, b) => b.puncte - a.puncte);
      confetti(80); sunet('insigna');
      zona.replaceChildren(h('section', { class: 'card final' }, h('h2', {}, '🏆 Clasament'),
        h('ol', { class: 'podium' }, ord.map((e, i) => h('li', { style: { '--c': e.c } }, ['🥇', '🥈', '🥉', '🏅'][i], ' ', h('strong', {}, e.nume), ` – ${e.puncte} puncte`))),
        h('div', { class: 'rand-butoane' }, h('a', { class: 'btn', href: '#/clasa', onclick: () => setTimeout(aplicaSetari, 0) }, 'Concurs nou'))));
      desenScor(-1);
    };
    runda1();
  }
}
