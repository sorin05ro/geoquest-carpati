// Comparare tolerantă a răspunsurilor scrise: fără diacritice, majuscule, spații în plus, prefixe uzuale.
const PREFIXE = [
  'varful', 'vf', 'virful', 'muntii', 'm-tii', 'mtii', 'muntele', 'valea', 'raul', 'riul', 'depresiunea', 'depr',
  'dealul', 'dl', 'podisul', 'pod', 'campia', 'grupa', 'roci', 'rocile', 'cu', 'din', 'de', 'ai', 'a', 'al'
];

export function simplu(s) {
  return String(s ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[şș]/gi, 's').replace(/[ţț]/gi, 't')
    .toLowerCase()
    .replace(/[„”"'’`.,;:!?()\[\]]/g, ' ')
    .replace(/[–—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function farPrefixe(s) {
  let cuv = s.split(' ').filter(Boolean);
  while (cuv.length > 1 && PREFIXE.includes(cuv[0])) cuv.shift();
  // „Oltului” → „olt”, „Barcăului” → „barcau”: tăiem terminații de genitiv uzuale
  return cuv.map(c => c.replace(/(ului|ilor|lui|ul)$/, '')).join(' ').replace(/\b(m|metri)\b/g, '').replace(/\s+/g, ' ').trim();
}

export function normalizeaza(s) { return farPrefixe(simplu(s)); }

/** true dacă răspunsul elevului corespunde unuia dintre răspunsurile acceptate */
export function sePotriveste(raspuns, acceptate) {
  const r = normalizeaza(raspuns);
  if (!r) return false;
  return acceptate.some(a => {
    const n = normalizeaza(a);
    if (r === n) return true;
    // acceptă și formulări mai lungi care conțin răspunsul cheie (ex. „râul Olt” / „valea Oltului”)
    const cuvR = r.split(' '), cuvN = n.split(' ');
    return cuvN.length >= 1 && cuvN.every(c => cuvR.includes(c)) && cuvR.length <= cuvN.length + 2;
  });
}
