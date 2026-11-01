# Note pentru profesor

**Versiunea 1.1:** aplicația conține doar cei 32 de itemi din Testul nr. 1 și Testul nr. 2. Cele 170 de întrebări suplimentare din versiunea 1.0 au fost scoase. Jocul e organizat pe cele două teste, cu niveluri pe subiecte.

Puncte care cer confirmarea dumneavoastră. Niciunul nu blochează aplicația.

## 1. Harta (`data/harta.json`)

Numerele 1–15 au fost puse astfel:

| Nr. | Unitate | Nr. | Unitate |
|---|---|---|---|
| 1 | Grupa Nordică a Carpaților Orientali | 9 | Munții Poiana Ruscă |
| 2 | Grupa Centrală a Carpaților Orientali | 10 | Munții Apuseni |
| 3 | Grupa Sudică a Carpaților Orientali | 11 | Câmpia Transilvaniei |
| 4 | Grupa Bucegi | 12 | Podișul Someșan |
| 5 | Grupa Făgăraș | 13 | Podișul Târnavelor |
| 6 | Grupa Parâng | 14 | Subcarpații Transilvaniei |
| 7 | Grupa Retezat-Godeanu | 15 | Depresiunile de contact |
| 8 | Munții Banatului | | |

De verificat pe hartă:

- **Limita dintre 4 (Bucegi) și 5 (Făgăraș)** nu e desenată cu negru pe hartă: urmează un râu (Dâmbovița). Am tras-o pe linia râului. Dacă atingerea nu se potrivește exact, ajustați din *Modul Profesor → Calibrare hartă*.
- **Regiunea 15 (depresiunile de contact)** cuprinde cele trei zone marcate „15”, plus fâșia galbenă care coboară de la eticheta „15” din vest spre Munții Poiana Ruscă (Culoarul Mureșului / Orăștie). Dacă nu doriți ca această fâșie să conteze ca „depresiune de contact”, scoateți poligonul respectiv din `data/harta.json`.
- **Numerele 16–40** (Subcarpați, podișuri, câmpii, Delta Dunării) sunt inactive și pregătite pentru alte module GeoQuest.

## 2. Diferențe față de manual, rezolvate după lecțiile dumneavoastră

| Unde | Ce am ales |
|---|---|
| Vf. Bihor | Scris „Cucurbăta Mare”. În lecție apare „Curcubăta Mare”; aplicația acceptă ambele forme. |
| „Colinară” | Explicația urmează lecția: „stadiul incipient de eroziune”. În exercițiul de la Subiectul VI am formulat-o ca „relief de dealuri (coline), datorat stadiului incipient de eroziune”. |
| Munții Cernei (Testul nr. 2, Subiectul III) | Asociați cu Grupa Retezat-Godeanu, ca în barem. Lecția nu îi enumeră explicit printre masivele grupei. |

## 3. Cum se evaluează itemii deschiși în Marea Expediție

Ca evaluarea să fie automată și obiectivă, itemii cu răspuns deschis devin itemi cu alegere. Punctajul pe subiect rămâne cel din barem.

| Item | Cum se rezolvă | Punctaj |
|---|---|---|
| Subiectul IV.1 | Pentru fiecare literă A–D se alege numele dintr-o listă | 4 × 3p |
| Subiectul IV.2 și IV.3 | Se aleg 2 afirmații corecte dintr-o listă cu variante greșite | 2 × 2p |
| Subiectul V | Se marchează 2 asemănări și 2 deosebiri; lista conține și afirmații false | 4 × 2,5p |
| Subiectul VI (Testul nr. 1) | Pentru „depresiune” și pentru „colinară” se alege explicația | 2 × 5p |
| Subiectul VI (Testul nr. 2) | Se bifează 2 forme de relief sau procese (din listă sunt și două false) și se alege cauza fiecăreia | numire 2p + cauză 3p |

## 4. Deblocarea Marii Expediții

Expediția se deschide automat la 60% din stelele celor două teste. Dacă doriți ca elevii să dea testul simulat mai devreme, intrați în *Modul Profesor → Date și progres → Deblochează Marea Expediție*. Setarea se aplică pe dispozitivul respectiv.

## 5. Ce nu face (încă) aplicația

- Progresul **nu** se trimite profesorului: totul rămâne pe dispozitivul elevului. Elevul poate exporta un fișier de progres, pe care profesorul îl importă și îl vede.
- Sincronizarea între dispozitive (de exemplu Supabase, server în UE) este prevăzută pentru etapa a doua a GeoQuest. Stratul `js/storage.js` e gândit să poată fi înlocuit.
