// Cele 13 forme de exercițiu. Fiecare întoarce un controller:
//   { el, citeste() -> stare|null (null = incomplet), evalueaza(stare) -> 0..1, solutie() -> Node, indiciu() -> text|null }
import { h, amesteca } from './ui.js';
import { sePotriveste } from './normalize.js';
import { harta, numeRegiune } from './harta.js';
import { D } from './engine.js';

const LITERE = 'abcdefgh';

export function creeaza(q, opt = {}) {
  const f = TIPURI[q.tip];
  if (!f) return { el: h('p', {}, 'Tip necunoscut: ' + q.tip), citeste: () => ({}), evalueaza: () => 0, solutie: () => h('span') };
  const c = f(q, opt);
  c.el.classList.add('exercitiu', 'ex-' + q.tip);
  return c;
}

// -------------------------------------------------------------- 1. grilă (și 7. „ce număr e?” pe hartă)
function grila(q, opt, cuHarta = false) {
  let ales = null, eliminate = new Set();
  const ordine = q.variante.map((v, i) => i);
  const butoane = ordine.map(i => h('button', { class: 'varianta', type: 'button', 'aria-pressed': 'false', onclick: () => alege(i) },
    h('span', { class: 'litera' }, LITERE[i] + '.'), ' ', q.variante[i]));
  function alege(i) { if (eliminate.has(i)) return; ales = i; butoane.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i))); opt.onSchimbare?.(); }
  const el = h('div', {},
    cuHarta ? harta({ evidentiaza: [{ nr: q.nr, eticheta: '?' }], interactiv: false, clasa: 'mica' }) : null,
    h('div', { class: 'variante' }, butoane));
  return {
    el, citeste: () => ales === null ? null : ales,
    _rezolva: () => q.corect,
    evalueaza: (s) => s === q.corect ? 1 : 0,
    marcheaza: (s) => butoane.forEach((b, j) => { if (j === q.corect) b.classList.add('corect'); else if (j === s) b.classList.add('gresit'); }),
    solutie: () => h('span', {}, 'Răspuns corect: ', h('strong', {}, `${LITERE[q.corect]}. ${q.variante[q.corect]}`)),
    indiciu: () => {
      const gresite = amesteca(q.variante.map((_, i) => i).filter(i => i !== q.corect && !eliminate.has(i))).slice(0, Math.max(0, q.variante.length - 2));
      gresite.forEach(i => { eliminate.add(i); butoane[i].disabled = true; butoane[i].classList.add('eliminat'); if (ales === i) ales = null; });
      return 'Am eliminat două variante greșite (50/50).';
    }
  };
}

// -------------------------------------------------------------- 2. completare
function completare(q, opt) {
  const inp = h('input', { type: 'text', class: 'camp', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Răspunsul tău', placeholder: 'Scrie răspunsul…', oninput: () => opt.onSchimbare?.(),
    onkeydown: (e) => { if (e.key === 'Enter') opt.onEnter?.(); } });
  const enunt = q.enunt.split('……');
  const el = h('div', {}, h('p', { class: 'lacunar' }, enunt[0], h('span', { class: 'gol' }, '……'), enunt[1] || ''), inp);
  return {
    el, citeste: () => inp.value.trim() ? inp.value.trim() : null,
    _rezolva: () => q.raspunsuri_acceptate[0],
    evalueaza: (s) => sePotriveste(s, q.raspunsuri_acceptate) ? 1 : 0,
    marcheaza: (s) => inp.classList.add(sePotriveste(s, q.raspunsuri_acceptate) ? 'corect' : 'gresit'),
    solutie: () => h('span', {}, 'Răspuns corect: ', h('strong', {}, q.raspunsuri_acceptate[0])),
    indiciu: () => `Începe cu „${q.raspunsuri_acceptate[0].slice(0, 2)}…” și are ${q.raspunsuri_acceptate[0].length} caractere.`
  };
}

// -------------------------------------------------------------- 3. adevărat / fals
function adevaratFals(q, opt) {
  let ales = null;
  const b = [true, false].map(v => h('button', { class: 'varianta af', type: 'button', 'aria-pressed': 'false', onclick: () => { ales = v; b.forEach(x => x.setAttribute('aria-pressed', String(x.dataset.v === String(v)))); opt.onSchimbare?.(); }, 'data-v': String(v) }, v ? '✓ Adevărat' : '✗ Fals'));
  return {
    el: h('div', { class: 'variante doua' }, b), citeste: () => ales,
    _rezolva: () => q.adevarat,
    evalueaza: (s) => s === q.adevarat ? 1 : 0,
    marcheaza: (s) => b.forEach(x => { if (x.dataset.v === String(q.adevarat)) x.classList.add('corect'); else if (x.dataset.v === String(s)) x.classList.add('gresit'); }),
    solutie: () => h('span', {}, 'Afirmația este ', h('strong', {}, q.adevarat ? 'adevărată' : 'falsă'), '. Din lecție: „', q.sursa, '”'),
    indiciu: () => 'Recitește lecția: ' + q.sursa.slice(0, 40) + '…'
  };
}

// -------------------------------------------------------------- 4. potrivire (atinge în A, apoi în B)
function potrivire(q, opt) {
  const perechi = {}; let selA = null;
  const cul = ['#d21f3c', '#2b6cb0', '#2d7a3e', '#b7791f', '#6b46c1', '#0f766e'];
  const ordB = amesteca(q.coloanaB.map((_, i) => i));
  const bA = q.coloanaA.map((t, i) => h('button', { class: 'pot-a', type: 'button', onclick: () => { selA = i; desen(); } }, h('span', { class: 'nr' }, i + 1 + '.'), ' ', t));
  const bB = ordB.map(j => h('button', { class: 'pot-b', type: 'button', 'data-j': j, onclick: () => { if (selA === null) return; perechi[selA] = j; selA = null; desen(); opt.onSchimbare?.(); } }, h('span', { class: 'nr' }, LITERE[j] + '.'), ' ', q.coloanaB[j]));
  function desen() {
    bA.forEach((b, i) => { b.classList.toggle('activ', selA === i); const j = perechi[i]; b.style.setProperty('--c', j !== undefined ? cul[i % cul.length] : 'transparent'); b.querySelector('.leg')?.remove(); if (j !== undefined) b.append(h('span', { class: 'leg' }, ' → ' + LITERE[j])); });
    bB.forEach(b => { const j = +b.dataset.j; const de = Object.keys(perechi).filter(i => perechi[i] === j); b.style.setProperty('--c', de.length ? cul[+de[0] % cul.length] : 'transparent'); });
  }
  const el = h('div', {}, h('p', { class: 'instr' }, 'Atinge un element din coloana A, apoi corespondentul lui din coloana B.'),
    h('div', { class: 'potrivire' }, h('div', { class: 'col' }, h('h4', {}, 'A'), bA), h('div', { class: 'col' }, h('h4', {}, 'B'), bB)));
  const n = q.coloanaA.length;
  return {
    el, citeste: () => Object.keys(perechi).length === n ? { ...perechi } : null,
    _rezolva: () => ({ ...q.perechi }),
    evalueaza: (s) => q.coloanaA.reduce((a, _, i) => a + (s[i] === q.perechi[i] ? 1 : 0), 0) / n,
    marcheaza: (s) => bA.forEach((b, i) => b.classList.add(s[i] === q.perechi[i] ? 'corect' : 'gresit')),
    solutie: () => h('ul', { class: 'sol' }, q.coloanaA.map((a, i) => h('li', {}, `${i + 1}. ${a} → ${LITERE[q.perechi[i]]}. ${q.coloanaB[q.perechi[i]]}`))),
    indiciu: () => { const i = q.coloanaA.findIndex((_, k) => perechi[k] !== q.perechi[k]); if (i < 0) return null; perechi[i] = q.perechi[i]; desen(); opt.onSchimbare?.(); return `Am legat eu: ${q.coloanaA[i]} → ${q.coloanaB[q.perechi[i]]}.`; }
  };
}

// -------------------------------------------------------------- 5. harta din test (A, B, C, D)
function hartaTest(q, opt) {
  const nume = D.harta.regiuni.filter(r => r.activ).map(r => r.nume);
  const sel = q.itemi.map(it => h('select', { class: 'camp', 'aria-label': `Unitatea marcată cu ${it.eticheta}`, onchange: () => opt.onSchimbare?.() },
    h('option', { value: '' }, '— alege —'), amesteca(nume).map(n => h('option', { value: n }, n))));
  const el = h('div', {}, harta({ evidentiaza: q.itemi.map(it => ({ nr: it.nr_harta, eticheta: it.eticheta })), interactiv: false }),
    h('div', { class: 'grila-select' }, q.itemi.map((it, i) => h('label', { class: 'rand-select' }, h('strong', {}, it.eticheta + ' = '), sel[i]))));
  const ok = (v, it) => v === numeRegiune(it.nr_harta);
  return {
    el, citeste: () => sel.every(s => s.value) ? sel.map(s => s.value) : null,
    _rezolva: () => q.itemi.map(it => numeRegiune(it.nr_harta)),
    evalueaza: (s) => q.itemi.reduce((a, it, i) => a + (ok(s[i], it) ? 1 : 0), 0) / q.itemi.length,
    marcheaza: (s) => sel.forEach((x, i) => x.classList.add(ok(s[i], q.itemi[i]) ? 'corect' : 'gresit')),
    solutie: () => h('ul', { class: 'sol' }, q.itemi.map(it => h('li', {}, `${it.eticheta} – ${numeRegiune(it.nr_harta)} (nr. ${it.nr_harta} pe hartă)`))),
    indiciu: () => { const i = q.itemi.findIndex((it, k) => !ok(sel[k].value, it)); if (i < 0) return null; sel[i].value = numeRegiune(q.itemi[i].nr_harta); opt.onSchimbare?.(); return `Am completat eu litera ${q.itemi[i].eticheta}.`; }
  };
}

// -------------------------------------------------------------- 6. atinge pe hartă
function hartaAtinge(q, opt) {
  let ales = null;
  const m = harta({ onAlege: (nr) => { ales = nr; m.svg.querySelectorAll('.regiune').forEach(g => g.classList.toggle('aleasa', +g.dataset.nr === nr)); info.textContent = nr ? `Ai ales regiunea nr. ${nr}.` : 'Atinge una dintre unitățile colorabile ale hărții.'; opt.onSchimbare?.(); } });
  const info = h('p', { class: 'instr', 'aria-live': 'polite' }, 'Atinge regiunea pe hartă.');
  return {
    el: h('div', {}, m, info), citeste: () => ales,
    _rezolva: () => q.tinta,
    evalueaza: (s) => s === q.tinta ? 1 : 0,
    marcheaza: (s) => { m.marcheaza(q.tinta, 'corect'); if (s !== q.tinta) m.marcheaza(s, 'gresit'); },
    solutie: () => h('span', {}, `${numeRegiune(q.tinta)} are numărul `, h('strong', {}, q.tinta), ' pe hartă.'),
    indiciu: () => { const r = D.harta.regiuni.find(x => x.nr === q.tinta); return `Caută printre numerele ${D.harta.regiuni.filter(x => x.activ && x.taram === r?.taram).map(x => x.nr).join(', ')}.`; }
  };
}

// -------------------------------------------------------------- 8. selecție multiplă (alege k afirmații corecte)
function selectieMultipla(q, opt) {
  const k = q.de_selectat || 2;
  const toate = amesteca([...q.corecte.map(t => ({ t, ok: true })), ...q.gresite.map(t => ({ t, ok: false }))]);
  const alese = new Set();
  const b = toate.map((x, i) => h('button', { class: 'varianta bifa', type: 'button', 'aria-pressed': 'false', onclick: () => {
    if (alese.has(i)) alese.delete(i); else { if (alese.size >= k) return info(`Poți alege doar ${k}.`); alese.add(i); }
    b[i].setAttribute('aria-pressed', String(alese.has(i))); opt.onSchimbare?.();
  } }, x.t));
  const nota = h('p', { class: 'instr' }, `Alege exact ${k} variante corecte.`);
  const info = (t) => { nota.textContent = t; setTimeout(() => nota.textContent = `Alege exact ${k} variante corecte.`, 1800); };
  return {
    el: h('div', {}, nota, h('div', { class: 'variante' }, b)), citeste: () => alese.size === k ? [...alese] : null,
    _rezolva: () => toate.map((x, i) => x.ok ? i : -1).filter(i => i >= 0).slice(0, k),
    evalueaza: (s) => Math.min(k, s.filter(i => toate[i].ok).length) / k,
    marcheaza: (s) => b.forEach((x, i) => { if (toate[i].ok) x.classList.add(s.includes(i) ? 'corect' : 'ratat'); else if (s.includes(i)) x.classList.add('gresit'); }),
    solutie: () => h('span', {}, 'Variante corecte: ', h('strong', {}, q.corecte.slice(0, 4).join('; '))),
    indiciu: () => { const i = toate.findIndex((x, j) => !x.ok && !alese.has(j) && !b[j].disabled); if (i < 0) return null; b[i].disabled = true; b[i].classList.add('eliminat'); return 'Am eliminat o variantă greșită.'; }
  };
}

// -------------------------------------------------------------- 9. comparare (asemănări / deosebiri)
function comparare(q, opt) {
  const [kA, kD] = q.de_selectat || [2, 2];
  const toate = amesteca([...q.asemanari.map(t => ({ t, tip: 'A' })), ...q.deosebiri.map(t => ({ t, tip: 'D' })), ...(q.capcane || []).map(t => ({ t, tip: 'X' }))]);
  const tag = {};
  const randuri = toate.map((x, i) => {
    const bt = ['A', 'D'].map(v => h('button', { class: 'mini ' + (v === 'A' ? 'as' : 'de'), type: 'button', 'aria-pressed': 'false', onclick: () => {
      if (tag[i] === v) delete tag[i];
      else { const nr = Object.values(tag).filter(z => z === v).length; if (nr >= (v === 'A' ? kA : kD)) return; tag[i] = v; }
      bt.forEach(z => z.setAttribute('aria-pressed', String(tag[i] === z.dataset.v))); opt.onSchimbare?.();
    }, 'data-v': v }, v === 'A' ? 'Asemănare' : 'Deosebire'));
    return h('div', { class: 'rand-comp' }, h('span', { class: 'af-text' }, x.t), h('span', { class: 'bt' }, bt));
  });
  const titlu = q.unitati ? h('p', { class: 'instr' }, `${q.unitati[0]} ↔ ${q.unitati[1]}: marchează ${kA} asemănări și ${kD} deosebiri. Atenție la afirmațiile false!`)
    : h('p', { class: 'instr' }, `Marchează ${kA} asemănări și ${kD} deosebiri. Atenție la afirmațiile false!`);
  const ok = (i, v) => toate[i].tip === v;
  return {
    el: h('div', { class: 'venn' }, titlu, randuri),
    citeste: () => { const v = Object.values(tag); return v.filter(z => z === 'A').length === kA && v.filter(z => z === 'D').length === kD ? { ...tag } : null; },
    _rezolva: () => { const t = {}; let a = 0, d = 0; toate.forEach((x, i) => { if (x.tip === 'A' && a < kA) { t[i] = 'A'; a++; } if (x.tip === 'D' && d < kD) { t[i] = 'D'; d++; } }); return t; },
    evalueaza: (s) => (Math.min(kA, Object.keys(s).filter(i => s[i] === 'A' && ok(i, 'A')).length) + Math.min(kD, Object.keys(s).filter(i => s[i] === 'D' && ok(i, 'D')).length)) / (kA + kD),
    marcheaza: (s) => randuri.forEach((r, i) => { if (s[i]) r.classList.add(ok(i, s[i]) ? 'corect' : 'gresit'); else if (toate[i].tip !== 'X') r.classList.add('ratat'); }),
    solutie: () => h('div', { class: 'sol' }, h('p', {}, h('strong', {}, 'Asemănări: '), q.asemanari.join('; ')), h('p', {}, h('strong', {}, 'Deosebiri: '), q.deosebiri.join('; ')), q.nota ? h('p', { class: 'mic' }, q.nota) : null),
    indiciu: () => { const i = toate.findIndex(x => x.tip === 'X'); if (i < 0) return null; randuri[i].classList.add('eliminat'); randuri[i].querySelectorAll('button').forEach(b => b.disabled = true); return 'Am tăiat o afirmație falsă – nu o folosi.'; }
  };
}

// -------------------------------------------------------------- 10. selecție dublă (a/b cu variante)
function selectieDubla(q, opt) {
  const ales = {};
  const blocuri = q.itemi.map((it, i) => {
    const v = amesteca([it.corect, ...it.variante_gresite]);
    const b = v.map(t => h('button', { class: 'varianta', type: 'button', 'aria-pressed': 'false', onclick: () => { ales[i] = t; b.forEach(x => x.setAttribute('aria-pressed', String(x.textContent === t))); opt.onSchimbare?.(); } }, t));
    return { b, el: h('div', { class: 'bloc' }, h('h4', {}, it.eticheta), h('div', { class: 'variante' }, b)) };
  });
  return {
    el: h('div', {}, blocuri.map(x => x.el)), citeste: () => Object.keys(ales).length === q.itemi.length ? { ...ales } : null,
    _rezolva: () => Object.fromEntries(q.itemi.map((it, i) => [i, it.corect])),
    evalueaza: (s) => q.itemi.reduce((a, it, i) => a + (s[i] === it.corect ? 1 : 0), 0) / q.itemi.length,
    marcheaza: (s) => blocuri.forEach((bl, i) => bl.b.forEach(x => { if (x.textContent === q.itemi[i].corect) x.classList.add('corect'); else if (x.textContent === s[i]) x.classList.add('gresit'); })),
    solutie: () => h('ul', { class: 'sol' }, q.itemi.map(it => h('li', {}, h('strong', {}, it.eticheta + ': '), it.corect))),
    indiciu: () => 'Depresiune = mai joasă decât munții din jur; colinară = relief de dealuri (coline).'
  };
}

// -------------------------------------------------------------- 11. cauză – efect
function cauzaEfect(q, opt) {
  const k = q.de_rezolvat || q.perechi_corecte.length;
  const formeFalse = ['relief glaciar', 'cratere vulcanice'];
  const forme = amesteca([...q.perechi_corecte.map(p => p.forma), ...formeFalse]);
  const cauze = amesteca([...q.perechi_corecte.map(p => p.cauza), 'acțiunea ghețarilor', 'erupțiile vulcanice']);
  const ales = {};
  const randuri = forme.map(f => {
    const cb = h('input', { type: 'checkbox', 'aria-label': f, onchange: () => { if (cb.checked && Object.keys(ales).length >= k) { cb.checked = false; return; } if (cb.checked) ales[f] = ''; else delete ales[f]; sel.disabled = !cb.checked; opt.onSchimbare?.(); } });
    const sel = h('select', { class: 'camp', disabled: true, 'aria-label': 'Cauza pentru ' + f, onchange: () => { ales[f] = sel.value; opt.onSchimbare?.(); } },
      h('option', { value: '' }, '— cauza —'), cauze.map(c => h('option', { value: c }, c)));
    return { f, el: h('div', { class: 'rand-ce' }, h('label', {}, cb, ' ', f), sel), sel, cb };
  });
  const corecta = (f) => q.perechi_corecte.find(p => p.forma === f);
  return {
    el: h('div', {}, h('p', { class: 'instr' }, `Bifează ${k} forme de relief/procese specifice și alege cauza fiecăreia.`), randuri.map(r => r.el)),
    citeste: () => Object.keys(ales).length === k && Object.values(ales).every(Boolean) ? { ...ales } : null,
    _rezolva: () => Object.fromEntries(q.perechi_corecte.slice(0, k).map(p => [p.forma, p.cauza])),
    evalueaza: (s) => Object.entries(s).reduce((a, [f, c]) => { const p = corecta(f); return a + (p ? .4 + (p.cauza === c ? .6 : 0) : 0); }, 0) / k,
    marcheaza: (s) => randuri.forEach(r => { if (r.f in s) r.el.classList.add(corecta(r.f) && corecta(r.f).cauza === s[r.f] ? 'corect' : 'gresit'); }),
    solutie: () => h('ul', { class: 'sol' }, q.perechi_corecte.map(p => h('li', {}, `${p.forma} ← ${p.cauza}`))),
    indiciu: () => `Atenție: „${formeFalse[0]}” și „${formeFalse[1]}” NU sunt specifice depresiunii.`
  };
}

// -------------------------------------------------------------- 12. ordonare (butoane sus/jos – merg la atingere și cu tastatura)
function ordonare(q, opt) {
  let ord = amesteca(q.elemente.map((_, i) => i));
  if (ord.every((v, i) => v === i) && ord.length > 1) ord = [...ord.slice(1), ord[0]];
  const lista = h('ol', { class: 'ordonare' });
  let atins = false;
  function desen() {
    lista.replaceChildren(...ord.map((i, poz) => h('li', { class: 'el-ord' },
      h('span', { class: 'txt' }, q.elemente[i]),
      h('span', { class: 'sageti' },
        h('button', { class: 'mini', type: 'button', 'aria-label': 'Mută mai sus', disabled: poz === 0, onclick: () => muta(poz, -1) }, '▲'),
        h('button', { class: 'mini', type: 'button', 'aria-label': 'Mută mai jos', disabled: poz === ord.length - 1, onclick: () => muta(poz, 1) }, '▼')))));
  }
  function muta(poz, d) { const j = poz + d; [ord[poz], ord[j]] = [ord[j], ord[poz]]; atins = true; desen(); opt.onSchimbare?.(); lista.children[j]?.querySelectorAll('button')[d < 0 ? 0 : 1]?.focus(); }
  desen();
  return {
    el: h('div', {}, h('p', { class: 'instr' }, 'Folosește săgețile pentru a pune elementele în ordinea cerută (primul sus).'), lista,
      h('button', { class: 'btn mic', type: 'button', onclick: () => { atins = true; opt.onSchimbare?.(); } }, 'Ordinea e gata')),
    citeste: () => atins ? [...ord] : null,
    _rezolva: () => q.elemente.map((_, i) => i),
    evalueaza: (s) => s.every((v, i) => v === i) ? 1 : 0,
    marcheaza: (s) => [...lista.children].forEach((li, p) => li.classList.add(s[p] === p ? 'corect' : 'gresit')),
    solutie: () => h('span', {}, 'Ordinea corectă: ', h('strong', {}, q.elemente.join(' → '))),
    indiciu: () => `Primul element este: ${q.elemente[0]}.`
  };
}

// -------------------------------------------------------------- 13. cine sunt eu? (indicii progresive)
function cineSunt(q, opt) {
  let vazute = 1;
  const lista = h('ol', { class: 'indicii' });
  const desen = () => lista.replaceChildren(...q.indicii.slice(0, vazute).map(t => h('li', {}, t)));
  desen();
  const g = grila({ ...q, variante: q.variante, corect: q.variante.indexOf(q.raspuns) }, opt);
  const btn = h('button', { class: 'btn mic', type: 'button', onclick: () => { if (vazute < q.indicii.length) { vazute++; desen(); if (vazute === q.indicii.length) btn.disabled = true; } } }, 'Încă un indiciu (−XP)');
  return {
    el: h('div', {}, lista, btn, g.el), citeste: g.citeste, _rezolva: g._rezolva,
    evalueaza: (s) => g.evalueaza(s) * (vazute === 1 ? 1 : vazute === 2 ? .8 : .6),
    marcheaza: g.marcheaza, solutie: g.solutie, indiciu: () => { if (vazute < q.indicii.length) { vazute++; desen(); return 'Ți-am dat încă un indiciu.'; } return g.indiciu(); },
    punctajComplet: (s) => g.evalueaza(s) === 1
  };
}

const TIPURI = {
  grila: (q, o) => grila(q, o),
  harta_numar: (q, o) => grila(q, o, true),
  completare, adevarat_fals: adevaratFals, potrivire, harta: hartaTest, harta_atinge: hartaAtinge,
  selectie_multipla: selectieMultipla, comparare, selectie_dubla: selectieDubla, cauza_efect: cauzaEfect, ordonare, cine_sunt: cineSunt
};
export const NUME_TIP = { grila: 'Grilă', harta_numar: 'Hartă – ce număr?', completare: 'Completare', adevarat_fals: 'Adevărat / Fals', potrivire: 'Potrivire', harta: 'Hartă – identificare', harta_atinge: 'Hartă – atinge', selectie_multipla: 'Alegere multiplă', comparare: 'Comparare', selectie_dubla: 'Explică', cauza_efect: 'Cauză – efect', ordonare: 'Ordonare', cine_sunt: 'Cine sunt eu?' };
