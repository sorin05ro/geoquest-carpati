# GeoQuest – Misiunea Carpați 🦉🏔️

Aplicație gamificată pentru **clasa a VIII-a**: Carpații Orientali, Carpații Meridionali, Carpații Occidentali și Depresiunea Colinară a Transilvaniei. Elevii învață prin joc și se pregătesc pentru **Testul nr. 1** și **Testul nr. 2**.

Un modul al proiectului GeoQuest. Mascota este **Geo, bufnița-cartograf**.

## Ce conține

- **Doar itemii din cele două teste: 32 de itemi** (Testul nr. 1 și Testul nr. 2), cu răspunsurile din barem. Nu există întrebări suplimentare.
- **2 tărâmuri, câte unul pentru fiecare test**, cu câte 4 niveluri pe subiecte: I; II; III + IV; V + VI.
- **Marea Expediție** simulează fiecare test complet, cu punctaj după barem: 90p + 10p din oficiu, nota = punctaj : 10.
- **Fișele celor 4 lecții** (Orientali, Meridionali, Occidentali, Depresiunea Colinară a Transilvaniei), pentru recitire.
- **Exerciții după forma itemilor din teste:** grilă, completare (acceptă și răspunsuri fără diacritice), potrivire, hartă cu literele A–D, alegere multiplă, comparare asemănări/deosebiri, explicare, cauză–efect.
- **Recompense:**
  - XP și 6 ranguri, de la Drumeț la Maestrul Carpaților;
  - 16 insigne, serie zilnică de învățare și 1–3 stele pe nivel;
  - flashcard-uri cu repetiție spațiată (sistem Leitner, 5 cutii);
  - greșelile revin mai târziu în același nivel, ca recapitulare.
- **Mod Clasă**, pentru tabla interactivă: concurs pe 2–4 echipe și „Roata norocului”, care alege subiectul (I–VI).
- **Mod Profesor**, protejat cu PIN:
  - activarea sau dezactivarea întrebărilor;
  - greșelile frecvente;
  - export și import al progresului, export al băncii de întrebări;
  - deblocarea expediției;
  - calibrarea hărții.
- **Funcționează offline** după prima deschidere și se poate instala pe telefon. Nu are conturi, cookie-uri sau reclame. Progresul rămâne doar pe dispozitivul elevului, iar elevul folosește doar o poreclă.

## Cum se folosește la clasă

1. Deschide aplicația pe tabla interactivă și intră în **Setări → Mod proiecție** (text mare, contrast ridicat).
2. Alege **Mod Clasă**: numărul de echipe, numele lor și sursa întrebărilor (Testul nr. 1, Testul nr. 2, ambele teste sau Roata norocului).
3. Echipele răspund pe rând: răspunsul corect aduce 10 puncte, cel cu indiciu 5 puncte. La final apare clasamentul.

Pentru teme, elevii deschid aceeași adresă pe telefon.

## Cum se modifică întrebările

Întrebările sunt în fișiere JSON, nu în cod:

| Fișier | Conținut |
|---|---|
| `data/intrebari_teste.json` | Cei 32 de itemi din testele nr. 1 și 2 (`origine: "test"`) |
| `data/intrebari_extra.json` | Gol: aplicația folosește doar itemii din teste |
| `data/lectii.json` | Tărâmurile (testele), nivelurile pe subiecte și fișele lecțiilor |
| `data/harta.json` | Regiunile hărții (1–15 active) și poligoanele lor |
| `data/insigne.json` | Insignele |

Câmpul `nivel` leagă itemul de un nivel: `t1s1`–`t1s4` pentru Testul nr. 1 și `t2s1`–`t2s4` pentru Testul nr. 2 (s1 = Subiectul I, s2 = Subiectul II, s3 = Subiectele III–IV, s4 = Subiectele V–VI). Fișierul se regenerează cu `python3 tools/genereaza.py`.

O întrebare se poate dezactiva și fără editare, din **Modul Profesor**.

După o modificare, rulează testele (vezi mai jos): ele verifică dacă fiecare răspuns corect primește punctaj maxim și dacă baremul dă tot 100 de puncte.

## Calibrarea hărții

Regiunile 1–15 au fost detectate automat din imaginea hărții. Dacă o zonă nu răspunde bine la atingere:

1. Deschide **Modul Profesor → Calibrare hartă**.
2. Alege regiunea și dă clic de-a lungul conturului ei.
3. Copiază rezultatul în `data/harta.json`, în câmpul `poligoane` al regiunii.

## Teste automate

```bash
python3 -m http.server 8765        # în folderul proiectului
node tests/ruleaza.mjs             # are nevoie de Playwright
```

Testele verifică:
- integritatea datelor;
- baremul: răspunsurile perfecte dau 100p și nota 10, cele greșite dau 10p și nota 1;
- recunoașterea răspunsurilor scrise (diacritice, majuscule, „râul Olt” = „Olt”);
- lipsa scroll-ului orizontal la 375, 768 și 1920 px.

Capturile de ecran se salvează în `tests/screenshots/`. Testele se pot rula și în browser, din `tests/teste.html`.

## Surse

- Lecțiile profesorului: *Carpații Orientali*, *Carpații Meridionali*, *Carpații Occidentali*, *Depresiunea Colinară a Transilvaniei*.
- Testele de evaluare *Carpații Românești* nr. 1 și nr. 2, cu baremele lor.

## Autor și licență

**Autor:** prof. Negraru Sorin Norocel, Școala Gimnazială Nr. 6, Râmnicu Sărat.

**Licență:**
- conținutul educațional (lecții, întrebări, hartă): [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/);
- codul: MIT (vezi `LICENSE`).
