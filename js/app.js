// GeoQuest – Misiunea Carpați: router și ecrane.
import { incarca, salveaza } from './storage.js';
import { h, geoSvg, geoSpune, toast, confetti, sunet, amesteca } from './ui.js';
import * as E from './engine.js';
import { creeaza, NUME_TIP } from './exercises.js';
import { ecranExpeditie, ecranAlegereExpeditie } from './expeditie.js';
import { ecranClasa } from './clasa.js';
import { ecranProfesor } from './profesor.js';

const app = document.getElementById('app');
const AVATARURI = ['🦉', '🦊', '🐻', '🦌', '🐺', '🦅', '🐿️', '🐐', '🦔', '🐝'];

// ---------------------------------------------------------------- antet
export function antet() {
  const s = incarca(); const r = E.rang();
  const bara = document.getElementById('antet');
  bara.replaceChildren(
    h('a', { href: '#/', class: 'logo', 'aria-label': 'Acasă' }, h('span', { html: geoSvg('normal', 36) }), h('span', {}, h('b', {}, 'GeoQuest'), h('small', {}, 'Misiunea Carpați'))),
    s.porecla ? h('div', { class: 'stat-antet' },
      h('span', { class: 'pastila', title: 'Seria de zile' }, '🔥 ', s.seria.zile || 0),
      h('a', { class: 'pastila', href: '#/profil', title: `Rang: ${r.nume}` }, r.icon, ' ', h('span', { class: 'ascuns-mic' }, r.nume + ' · '), s.xp, ' XP'),
      h('a', { class: 'pastila avatar', href: '#/profil', 'aria-label': 'Profil' }, s.avatar)) : null);
}

// ---------------------------------------------------------------- router
const RUTE = [
  [/^#\/?$/, acasa], [/^#\/taram\/(\w+)$/, ecranTaram], [/^#\/nivel\/(\w+)$/, ecranNivel], [/^#\/invata\/(\w+)$/, ecranInvata], [/^#\/lectii$/, ecranLectii],
  [/^#\/flash(?:\/(\w+))?$/, ecranFlash], [/^#\/expeditie$/, () => ecranAlegereExpeditie(app)], [/^#\/expeditie\/(\d)$/, (n) => ecranExpeditie(app, +n)],
  [/^#\/profil$/, ecranProfil], [/^#\/clasa$/, () => ecranClasa(app)], [/^#\/profesor$/, () => ecranProfesor(app)], [/^#\/setari$/, ecranSetari],
];
function ruta() {
  const s = incarca();
  aplicaSetari();
  if (!s.porecla && location.hash !== '#/profesor') { antet(); return ecranStart(); }
  const hs = location.hash || '#/';
  for (const [re, f] of RUTE) { const m = hs.match(re); if (m) { antet(); app.replaceChildren(); window.scrollTo(0, 0); f(...m.slice(1)); app.focus({ preventScroll: true }); return; } }
  location.hash = '#/';
}
export function aplicaSetari() {
  const s = incarca();
  document.documentElement.toggleAttribute('data-text-mare', !!s.setari.textMare);
  document.documentElement.toggleAttribute('data-proiectie', !!s.setari.proiectie);
}

// ---------------------------------------------------------------- start (poreclă + avatar)
function ecranStart() {
  let avatar = '🦉';
  const inp = h('input', { class: 'camp', maxlength: 20, placeholder: 'de ex. Vulturul Carpaților', 'aria-label': 'Porecla ta', autocomplete: 'off' });
  const av = AVATARURI.map(a => h('button', { class: 'avatar-btn', type: 'button', 'aria-pressed': String(a === avatar), 'aria-label': 'Avatar ' + a, onclick: () => { avatar = a; av.forEach(b => b.setAttribute('aria-pressed', String(b.textContent === a))); } }, a));
  app.replaceChildren(h('section', { class: 'card start' },
    h('div', { class: 'geo-mare', html: geoSvg('bucuros', 120) }),
    h('h1', {}, 'Bun venit în Misiunea Carpați!'),
    h('p', {}, 'Sunt Geo, bufnița-cartograf. Ne antrenăm pe Testul nr. 1 și Testul nr. 2 (Carpații și Depresiunea Colinară a Transilvaniei), subiect cu subiect – apoi plecăm în Marea Expediție, cu nota calculată după barem.'),
    h('label', { class: 'eticheta' }, 'Alege o poreclă (nu folosi numele tău real):', inp),
    h('p', { class: 'eticheta' }, 'Alege un avatar:'), h('div', { class: 'avatare' }, av),
    h('button', { class: 'btn mare', onclick: () => {
      const p = inp.value.trim(); if (!p) { toast('Scrie o poreclă.'); inp.focus(); return; }
      const s = incarca(); s.porecla = p.slice(0, 20); s.avatar = avatar; salveaza(); E.marcheazaZi(); location.hash = '#/'; ruta();
    } }, 'Pornim! 🧭'),
    h('p', { class: 'mic' }, 'Progresul se păstrează doar pe acest dispozitiv. Nu se colectează date personale.')));
}

// ---------------------------------------------------------------- acasă: harta tărâmurilor
function acasa() {
  const s = incarca();
  const boss = E.bossDeblocat();
  const salut = s.seria.zile >= 2 ? `Salut, ${s.porecla}! Ești în a ${s.seria.zile}-a zi la rând. 🔥` : `Salut, ${s.porecla}! Alege un test și hai la antrenament.`;
  app.append(
    geoSpune(salut, 'bucuros'),
    h('h1', { class: 'titlu-sectiune' }, 'Harta tărâmurilor'),
    h('div', { class: 'taramuri' }, E.D.taramuri.map((t, i) => {
      const p = E.progresTaram(t);
      return h('a', { class: 'taram', href: `#/taram/${t.id}`, style: { '--c': t.culoare } },
        h('span', { class: 'icon' }, t.icon), h('span', { class: 'nr' }, `Tărâmul ${i + 1}`), h('strong', {}, t.nume),
        h('span', { class: 'progres', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': p.max, 'aria-valuenow': p.are, 'aria-label': 'Stele' }, h('span', { style: { width: (p.procent * 100) + '%' } })),
        h('span', { class: 'mic' }, `⭐ ${p.are} / ${p.max}`));
    }),
      h(boss ? 'a' : 'div', { class: 'taram boss' + (boss ? '' : ' blocat'), href: boss ? '#/expeditie' : null, style: { '--c': '#12355b' } },
        h('span', { class: 'icon' }, boss ? '🏆' : '🔒'), h('span', { class: 'nr' }, 'Tărâmul 3'), h('strong', {}, 'Marea Expediție'),
        h('span', { class: 'mic' }, boss ? 'Testul nr. 1 și Testul nr. 2, cu punctaj după barem.' : 'Se deschide când ai 60% din stelele celor două teste.'))),
    h('h2', { class: 'titlu-sectiune' }, 'Antrenament rapid'),
    h('div', { class: 'actiuni' },
      h('a', { class: 'actiune', href: '#/lectii' }, h('span', {}, '📖'), h('strong', {}, 'Fișele lecțiilor'), h('small', {}, 'Recitește înainte de test')),
      h('a', { class: 'actiune', href: '#/flash' }, h('span', {}, '🃏'), h('strong', {}, 'Flashcard-uri'), h('small', {}, `${E.carduriScadente(null, 999).length} de repetat azi`)),
      h('a', { class: 'actiune', href: '#/clasa' }, h('span', {}, '👥'), h('strong', {}, 'Mod Clasă'), h('small', {}, 'Concurs pe echipe, la tablă')),
      h('a', { class: 'actiune', href: '#/profil' }, h('span', {}, '🏅'), h('strong', {}, 'Insigne'), h('small', {}, `${s.insigne.length} / ${E.D.insigne.length}`)),
      h('a', { class: 'actiune', href: '#/setari' }, h('span', {}, '⚙️'), h('strong', {}, 'Setări'), h('small', {}, 'Sunet, text mare, proiecție'))));
}

// ---------------------------------------------------------------- tărâm
function ecranTaram(id) {
  const t = E.D.taramuri.find(x => x.id === id); if (!t) return (location.hash = '#/');
  const s = incarca();
  app.append(
    h('nav', { class: 'pesmet' }, h('a', { href: '#/' }, '← Harta tărâmurilor')),
    h('header', { class: 'cap-taram', style: { '--c': t.culoare } }, h('span', { class: 'icon' }, t.icon), h('h1', {}, t.nume)),
    h('div', { class: 'actiuni doua' },
      h('a', { class: 'actiune', href: '#/lectii' }, h('span', {}, '📖'), h('strong', {}, 'Fișele lecțiilor'), h('small', {}, 'Carpații și Depresiunea Colinară')),
      h('a', { class: 'actiune', href: `#/flash/${t.id}` }, h('span', {}, '🃏'), h('strong', {}, 'Flashcard-uri'), h('small', {}, 'Repetiție spațiată'))),
    h('ol', { class: 'niveluri' }, t.niveluri.map((n, i) => {
      const st = s.stele[n.id] || 0; const nr = E.intrebariNivel(n.id).length;
      return h('li', {}, h('a', { class: 'nivel', href: `#/nivel/${n.id}` },
        h('span', { class: 'nr-nivel' }, i + 1), h('span', { class: 'tn' }, h('strong', {}, n.titlu), h('small', {}, `${Math.min(10, nr)} întrebări`)),
        h('span', { class: 'stele', 'aria-label': `${st} stele din 3` }, '★'.repeat(st), h('span', { class: 'gol' }, '★'.repeat(3 - st)))));
    })));
}

// ---------------------------------------------------------------- învață
function ecranLectii() {
  app.append(h('nav', { class: 'pesmet' }, h('a', { href: '#/' }, '← Acasă')), h('h1', { class: 'titlu-sectiune' }, '📖 Fișele lecțiilor'),
    geoSpune('Toți itemii din cele două teste se sprijină pe aceste patru lecții. Recitește-le înainte de antrenament.', 'gandeste'),
    h('div', { class: 'taramuri' }, E.D.lectiiIndex.map(l => h('a', { class: 'taram', href: `#/invata/${l.id}`, style: { '--c': l.culoare } },
      h('span', { class: 'icon' }, l.icon), h('strong', {}, l.nume), h('span', { class: 'mic' }, `${E.D.lectii[l.id].length} fișe`)))));
}

function ecranInvata(id) {
  const t = E.D.lectiiIndex.find(x => x.id === id); if (!t) return (location.hash = '#/lectii');
  const fise = E.D.lectii[id]; let i = 0;
  const zona = h('div');
  const desen = () => {
    const f = fise[i];
    zona.replaceChildren(h('article', { class: 'card fisa', style: { '--c': t.culoare } },
      h('p', { class: 'mic' }, `Fișa ${i + 1} din ${fise.length}`), h('h2', {}, f.titlu), h('ul', {}, f.puncte.map(p => h('li', {}, p)))),
      h('div', { class: 'rand-butoane' },
        h('button', { class: 'btn sec', disabled: i === 0, onclick: () => { i--; desen(); } }, '← Înapoi'),
        i < fise.length - 1 ? h('button', { class: 'btn', onclick: () => { i++; desen(); } }, 'Mai departe →')
          : h('a', { class: 'btn', href: '#/lectii' }, 'Gata – înapoi la lecții 📖')));
  };
  desen();
  app.append(h('nav', { class: 'pesmet' }, h('a', { href: '#/lectii' }, '← Fișele lecțiilor')), geoSpune('Citește cu atenție: itemii din teste se sprijină pe aceste fișe.', 'gandeste'), zona);
}

// ---------------------------------------------------------------- nivel
function ecranNivel(nivelId) {
  const t = E.D.taramuri.find(x => x.niveluri.some(n => n.id === nivelId)); if (!t) return (location.hash = '#/');
  const nivel = t.niveluri.find(n => n.id === nivelId);
  const coada = E.construiesteNivel(nivelId).map(q => ({ q, repetat: false }));
  const total = coada.length;
  let poz = 0, primaIncercare = 0, xpCastigat = 0, serie = 0; const insigneNoi = [];
  const zona = h('div', { class: 'zona-nivel' });
  app.append(h('nav', { class: 'pesmet' }, h('a', { href: `#/taram/${t.id}` }, '← ' + t.nume)), h('h1', { class: 'titlu-nivel' }, nivel.titlu), zona);

  function urmatoarea() {
    if (poz >= coada.length) return final();
    const { q, repetat } = coada[poz];
    let indiciuFolosit = false, verificat = false;
    const progres = Math.min(poz, total) / total;
    const btnVer = h('button', { class: 'btn', type: 'button', onclick: () => verifica() }, 'Verifică');
    const ex = creeaza(q, { onEnter: () => verifica() });
    const feedback = h('div', { 'aria-live': 'polite' });
    const btnInd = ex.indiciu ? h('button', { class: 'btn sec', type: 'button', onclick: () => { const m = ex.indiciu(); if (m) { indiciuFolosit = true; feedback.replaceChildren(geoSpune(m, 'gandeste')); } } }, '🦉 Indiciu') : null;
    zona.replaceChildren(
      h('div', { class: 'bara-progres', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(progres * 100) }, h('span', { style: { width: progres * 100 + '%' } })),
      h('div', { class: 'card intrebare' },
        h('div', { class: 'meta-q' }, h('span', { class: 'eticheta-tip' }, NUME_TIP[q.tip] || q.tip), q.origine === 'test' ? h('span', { class: 'eticheta-test' }, `Din Testul nr. ${q.test}`) : null, repetat ? h('span', { class: 'eticheta-rep' }, '↻ Mai încearcă') : null),
        q.tip === 'completare' ? null : h('h2', { class: 'enunt' }, q.enunt),
        ex.el, feedback,
        h('div', { class: 'rand-butoane' }, btnInd, btnVer)));
    ex.el.querySelector('input,button,select')?.focus({ preventScroll: true });

    function verifica() {
      if (verificat) return;
      const st = ex.citeste();
      if (st === null) { toast('Mai întâi răspunde complet. 🙂'); return; }
      verificat = true;
      const fr = ex.evalueaza(st);
      ex.marcheaza?.(st);
      ex.el.querySelectorAll('button,input,select').forEach(x => x.disabled = true);
      const corect = fr >= .999 || (ex.punctajComplet && ex.punctajComplet(st));
      if (!repetat) primaIncercare += corect ? 1 : fr >= .5 ? .5 : 0;
      let xp = corect ? (indiciuFolosit || repetat ? 5 : Math.round(10 * Math.max(fr, .6))) : fr >= .5 ? 3 : 0;
      if (corect) { serie++; if (serie % 5 === 0) { xp += 20; toast(`Serie de ${serie}! +20 XP bonus 🔥`, 'ok'); } } else serie = 0;
      xpCastigat += xp; const rangNou = xp ? E.adaugaXP(xp) : null;
      insigneNoi.push(...E.inregistreaza(q, corect));
      if (!corect) { E.raspunsCard(q.id, false); if (!repetat) coada.push({ q, repetat: true }); }
      sunet(corect ? 'corect' : 'gresit');
      feedback.replaceChildren(h('div', { class: 'feedback ' + (corect ? 'ok' : 'nu') },
        geoSpune(h('span', {}, h('strong', {}, corect ? ['Bravo! ', 'Exact! ', 'Corect! ', 'Super! '][poz % 4] : fr >= .5 ? 'Aproape! ' : 'Nu-i nimic, învățăm! '), q.explicatie_geo), corect ? 'bucuros' : 'gandeste'),
        corect ? null : h('p', { class: 'solutie' }, ex.solutie()),
        h('details', { class: 'sursa' }, h('summary', {}, '📖 Din lecție'), h('p', {}, q.sursa || '')),
        xp ? h('p', { class: 'xp-castigat' }, `+${xp} XP`) : null));
      if (rangNou) { confetti(); toast(`Rang nou: ${rangNou.icon} ${rangNou.nume}!`, 'ok'); }
      btnVer.textContent = poz + 1 >= coada.length ? 'Vezi rezultatul' : 'Continuă →';
      btnVer.onclick = () => { poz++; urmatoarea(); };
      btnInd && (btnInd.disabled = true);
      btnVer.focus();
    }
  }

  function final() {
    const proc = primaIncercare / total; const st = E.stele(proc);
    insigneNoi.push(...E.salveazaStele(nivelId, st));
    E.marcheazaZi(); insigneNoi.push(...E.inregistreaza({ etichete: [] }, true));
    if (st >= 2) confetti(); sunet(st ? 'nivel' : 'gresit');
    const idx = t.niveluri.findIndex(n => n.id === nivelId); const urm = t.niveluri[idx + 1];
    zona.replaceChildren(h('section', { class: 'card final' },
      h('div', { class: 'geo-mare', html: geoSvg(st >= 2 ? 'bucuros' : st ? 'normal' : 'trist', 110) }),
      h('h2', {}, st === 3 ? 'Nivel perfect!' : st === 2 ? 'Foarte bine!' : st === 1 ? 'Ai trecut nivelul!' : 'Mai încearcă o dată!'),
      h('p', { class: 'stele mari', 'aria-label': `${st} stele din 3` }, '★'.repeat(st), h('span', { class: 'gol' }, '★'.repeat(3 - st))),
      h('p', {}, `Corecte din prima: ${Math.round(proc * 100)}% · +${xpCastigat} XP`),
      insigneNoi.length ? h('div', { class: 'insigne-noi' }, h('h3', {}, 'Insigne noi!'), insigneNoi.map(i => h('div', { class: 'insigna castigata' }, h('span', { class: 'ic' }, i.icon), h('strong', {}, i.nume)))) : null,
      h('div', { class: 'rand-butoane' },
        h('button', { class: 'btn sec', onclick: () => ruta() }, '↻ Reia nivelul'),
        urm ? h('a', { class: 'btn', href: `#/nivel/${urm.id}` }, 'Nivelul următor →') : h('a', { class: 'btn', href: `#/taram/${t.id}` }, 'Înapoi la tărâm'))));
    if (insigneNoi.length) { sunet('insigna'); confetti(60); }
    antet();
  }
  urmatoarea();
}

// ---------------------------------------------------------------- flashcard-uri
function ecranFlash(taram) {
  const lista = E.carduriScadente(taram || null, 20);
  const cutii = E.statisticaLeitner();
  const t = taram ? E.D.taramuri.find(x => x.id === taram) : null;
  app.append(h('nav', { class: 'pesmet' }, h('a', { href: t ? `#/taram/${t.id}` : '#/' }, '← ' + (t ? t.nume : 'Acasă'))),
    h('h1', { class: 'titlu-sectiune' }, '🃏 Flashcard-uri' + (t ? ' – ' + t.nume : '')),
    h('p', { class: 'leitner' }, ['Cutia 1', 'Cutia 2', 'Cutia 3', 'Cutia 4', 'Cutia 5'].map((c, i) => h('span', { class: 'cutie c' + (i + 1) }, c + ': ', h('b', {}, cutii[i])))));
  if (!lista.length) { app.append(geoSpune('Nu ai carduri de repetat acum. Revino mâine – sau joacă un nivel!', 'bucuros')); return; }
  let i = 0, stiute = 0; const zona = h('div'); app.append(zona);
  const desen = () => {
    if (i >= lista.length) { zona.replaceChildren(geoSpune(`Gata! Ai știut ${stiute} din ${lista.length} carduri. Cardurile știute revin mai rar, cele greșite – mâine.`, 'bucuros'), h('a', { class: 'btn', href: '#/' }, 'Acasă')); antet(); return; }
    const c = lista[i]; let intoarsa = false;
    const card = h('button', { class: 'flashcard', type: 'button', 'aria-label': 'Întoarce cardul', onclick: () => { intoarsa = !intoarsa; card.classList.toggle('intors', intoarsa); btns.hidden = !intoarsa; } },
      h('div', { class: 'fata' }, h('small', {}, `Cardul ${i + 1} din ${lista.length} · atinge ca să-l întorci`), h('p', {}, c.fata)),
      h('div', { class: 'verso' }, h('p', { class: 'raspuns' }, c.verso), h('small', {}, '📖 ' + (c.sursa || ''))));
    const btns = h('div', { class: 'rand-butoane', hidden: true },
      h('button', { class: 'btn sec', onclick: () => { E.raspunsCard(c.id, false); i++; desen(); } }, '✗ Nu știam'),
      h('button', { class: 'btn', onclick: () => { const ins = E.raspunsCard(c.id, true); if (ins) { confetti(); toast(`Insignă nouă: ${ins.icon} ${ins.nume}`, 'ok'); } stiute++; E.adaugaXP(2); i++; desen(); } }, '✓ Știam'));
    zona.replaceChildren(card, btns); card.focus();
  };
  desen();
}

// ---------------------------------------------------------------- profil
function ecranProfil() {
  const s = incarca(); const r = E.rang();
  const ex = s.expeditii || {};
  app.append(h('section', { class: 'card profil' },
    h('div', { class: 'avatar-mare' }, s.avatar), h('h1', {}, s.porecla),
    h('p', { class: 'rang' }, r.icon, ' ', h('strong', {}, r.nume), ` · ${s.xp} XP`),
    h('div', { class: 'progres lat', role: 'progressbar', 'aria-valuenow': Math.round(r.progres * 100), 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('span', { style: { width: r.progres * 100 + '%' } })),
    h('p', { class: 'mic' }, r.urmator ? `Încă ${r.urmator.xp - s.xp} XP până la ${r.urmator.icon} ${r.urmator.nume}` : 'Ai atins rangul suprem!'),
    h('p', {}, `🔥 Seria: ${s.seria.zile || 0} zile · ⭐ ${Object.values(s.stele).reduce((a, b) => a + b, 0)} stele`),
    Object.keys(ex).length ? h('p', {}, '🏆 Expediții: ', Object.entries(ex).map(([k, v]) => `Testul nr. ${k} – nota ${v.nota.toFixed(2)}`).join(' · ')) : null),
    h('h2', { class: 'titlu-sectiune' }, `Insigne (${s.insigne.length} / ${E.D.insigne.length})`),
    h('div', { class: 'insigne' }, E.D.insigne.map(i => h('div', { class: 'insigna' + (s.insigne.includes(i.id) ? ' castigata' : '') },
      h('span', { class: 'ic' }, s.insigne.includes(i.id) ? i.icon : '🔒'), h('strong', {}, i.nume), h('small', {}, i.descriere)))),
    h('h2', { class: 'titlu-sectiune' }, 'Ranguri'),
    h('ol', { class: 'ranguri' }, E.RANGURI.map((x, k) => h('li', { class: k <= r.index ? 'atins' : '' }, x.icon, ' ', x.nume, h('small', {}, ` – ${x.xp} XP`)))));
}

// ---------------------------------------------------------------- setări
function ecranSetari() {
  const s = incarca();
  const comut = (cheie, text, desc) => h('label', { class: 'comutator' }, h('input', { type: 'checkbox', checked: !!s.setari[cheie], onchange: (e) => { s.setari[cheie] = e.target.checked; salveaza(); aplicaSetari(); } }), h('span', {}, h('strong', {}, text), h('small', {}, desc)));
  const inp = h('input', { class: 'camp', value: s.porecla, maxlength: 20, 'aria-label': 'Porecla' });
  app.append(h('h1', { class: 'titlu-sectiune' }, '⚙️ Setări'),
    h('section', { class: 'card setari' },
      comut('sunet', 'Sunet', 'Efecte scurte la răspunsuri și insigne.'),
      comut('cronometru', 'Cronometru în Marea Expediție', '50 de minute, ca la test.'),
      comut('textMare', 'Text mare', 'Litere și butoane mai mari.'),
      comut('proiectie', 'Mod proiecție (tablă interactivă)', 'Contrast ridicat, totul mai mare.'),
      h('label', { class: 'eticheta' }, 'Porecla', inp),
      h('div', { class: 'avatare' }, AVATARURI.map(a => h('button', { class: 'avatar-btn', 'aria-pressed': String(a === s.avatar), onclick: (e) => { s.avatar = a; salveaza(); e.currentTarget.parentNode.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.textContent === a))); antet(); } }, a))),
      h('div', { class: 'rand-butoane' }, h('button', { class: 'btn', onclick: () => { if (inp.value.trim()) { s.porecla = inp.value.trim(); salveaza(); antet(); toast('Salvat.', 'ok'); } } }, 'Salvează porecla'),
        h('a', { class: 'btn sec', href: '#/profesor' }, '🔐 Modul Profesor'))));
}

// ---------------------------------------------------------------- pornire
window.addEventListener('hashchange', ruta);
(async () => {
  try { await E.incarcaDate(); }
  catch (e) { app.replaceChildren(h('div', { class: 'card' }, h('h1', {}, 'Nu am putut încărca datele'), h('p', {}, 'Verifică conexiunea și reîncarcă pagina.'))); return; }
  if (incarca().porecla) E.marcheazaZi();
  ruta();
})();
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
export { ruta };
