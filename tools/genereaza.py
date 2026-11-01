# Generează data/lectii.json, data/intrebari_teste.json, data/intrebari_extra.json, data/insigne.json, data/taramuri.json
import json, random
random.seed(2026)
OUT = '/home/claude/gqc/data/'

# ---------------------------------------------------------------- LECȚII (secțiunea 3 a meta-promptului)
L = {}
L['orientali'] = [
 ("Poziție și limite", [
  "Sunt situați în estul Depresiunii Colinare a Transilvaniei, între granița cu Ucraina (la nord) și Valea Prahovei (la sud-vest).",
  "La est domină, printr-o diferență de altitudine de 700–1000 m, Podișul Moldovei și Subcarpații Moldovei.",
  "La sud se află Subcarpații Curburii, iar la vest Depresiunea Colinară a Transilvaniei, Dealurile de Vest și Câmpia de Vest.",
  "La sud-vest sunt dominați de înălțimile de peste 2000 m ale Carpaților Meridionali."]),
 ("Caracteristici", [
  "Au înălțimi mijlocii (circa 1300 m), rar trecând de 1800 m.",
  "Culmile se desfășoară în șiruri paralele, orientate în cea mai mare parte NV–SE (de la sud de Valea Trotușului se curbează spre SV).",
  "Sunt alcătuiți din roci vulcanice (în vest), șisturi cristaline (în centru) și roci sedimentare cutate (la est și sud).",
  "Fragmentarea este accentuată: culmile închid depresiuni largi (Maramureșului, Giurgeului, Ciucului ș.a.).",
  "În munții înalți (Rodnei și, mai puțin, Maramureșului și Călimani) este întâlnit relieful glaciar."]),
 ("Grupa Nordică – Carpații Maramureșului și Bucovinei", [
  "Limite: N – granița cu Ucraina; S – aliniamentul Depr. Dornelor – Pasul Mestecăniș – valea Moldovei.",
  "Altitudinea maximă: 2303 m, Vf. Pietrosul Rodnei (Munții Rodnei).",
  "Roci vulcanice: Oaș, Gutâi, Țibleș, Bârgău. Roci metamorfice: Maramureșului, Rodnei, Suhard, Obcina Mestecăniș. Roci sedimentare: Obcina Feredeu, Obcina Mare.",
  "Tipuri de relief: vulcanic, glaciar, carstic.",
  "Depresiuni: Maramureșului, Dornelor, Câmpulung."]),
 ("Grupa Centrală – Carpații Moldo-Transilvani", [
  "Limite: N – aliniamentul Depr. Dornelor – Pasul Mestecăniș – valea Moldovei; S – Pasul Oituz – valea Oituzului.",
  "Altitudinea maximă: 2100 m, Vf. Pietrosul Călimanilor (Munții Călimani).",
  "Roci vulcanice: Călimani, Gurghiu, Harghita. Roci metamorfice: Bistriței, Giurgeu, Hășmaș. Roci sedimentare: Stânișoarei, Tarcău, Ceahlău.",
  "Tipuri de relief: vulcanic, carstic.",
  "Depresiuni: Giurgeu, Ciuc, Comănești."]),
 ("Grupa Sudică – Carpații Curburii", [
  "Limite: N – Pasul Oituz – valea Oituzului; V – valea Prahovei.",
  "Altitudinea maximă: 1954 m, Vf. Ciucaș (Munții Ciucaș).",
  "Roci sedimentare: Vrancei, Buzăului, Ciucaș.",
  "Tip de relief: carstic.",
  "Depresiunea Brașov."]),
]
L['meridionali'] = [
 ("Prezentare și limite", [
  "Sunt cei mai înalți dintre Carpați, fiind numiți și „Alpii Transilvaniei”.",
  "Limite: E – Valea Prahovei; S – Subcarpații Curburii și Getici, Podișul Mehedinți; V – Culoarul Timiș–Cerna; N – Valea Bistrei – Depr. Hațeg – Culoarul Orăștie – Depr. Transilvaniei."]),
 ("Caracteristici", [
  "S-au format prin încrețire în timpul orogenezei alpine.",
  "Altitudinea maximă este de 2544 m, în Vf. Moldoveanu (Munții Făgăraș); altitudinea medie este de 1150 m.",
  "Prezintă roci metamorfice pe scară largă, dar întâlnim și calcar și conglomerate.",
  "Orientarea culmilor este E–V.",
  "Tipuri de relief: glaciar, carstic, pe conglomerate.",
  "Prezintă masivitate accentuată, datorată durității rocilor.",
  "Sunt traversați parțial de Dâmbovița și Jiu și în totalitate de Olt."]),
 ("Grupa Bucegi", [
  "Cuprinsă între valea Prahovei și valea Dâmboviței.",
  "Altitudinea maximă: 2505 m, Vf. Omu.",
  "Relief carstic și pe conglomerate.",
  "Roci: șisturi cristaline (Leaota), conglomerate (Bucegi), calcar (Piatra Craiului).",
  "Culoarul depresionar Rucăr – Bran."]),
 ("Grupa Făgăraș", [
  "Cuprinsă între valea Dâmboviței și valea Oltului.",
  "Altitudinea maximă: 2544 m, Vf. Moldoveanu.",
  "Relief carstic și glaciar.",
  "Șisturi cristaline (Făgăraș, Cozia, Frunții, Ghițu, Iezer).",
  "Depresiunea Loviștei."]),
 ("Grupa Parâng", [
  "Cuprinsă între valea Oltului și valea Jiului.",
  "Altitudinea maximă: 2519 m, Vf. Parângul Mare.",
  "Relief carstic și glaciar.",
  "Șisturi cristaline și calcar (Parâng, Șureanu, Căpățânii, Lotrului).",
  "Depresiunea Petroșani."]),
 ("Grupa Retezat-Godeanu", [
  "Cuprinsă între valea Jiului și culoarul Timiș–Cerna.",
  "Altitudinea maximă: 2509 m, Vf. Peleaga.",
  "Relief carstic și glaciar.",
  "Șisturi cristaline și calcar (Retezat, Godeanu, Mehedinți, Vâlcan, Țarcu).",
  "Depresiunea Hațeg."]),
]
L['occidentali'] = [
 ("Prezentare și limite", [
  "Reprezintă cea mai joasă și mai fragmentată unitate carpatică.",
  "Limite: S – Valea Dunării; N – Valea Barcăului; E – Depresiunea Transilvaniei, Culoarul Alba Iulia – Turda, Culoarul Orăștie, Depr. Hațeg, Valea Bistrei, Culoarul Timiș–Cerna; V – Câmpia și Dealurile de Vest."]),
 ("Caracteristici", [
  "S-au format prin încrețire în timpul orogenezei alpine.",
  "Altitudinea maximă este de 1849 m, în Vf. Bihor; altitudinea medie este de 640 m.",
  "Prezintă roci metamorfice, sedimentare, vulcanice.",
  "Prezintă relief carstic și vulcanic.",
  "Relieful este foarte fragmentat."]),
 ("Munții Banatului", [
  "Sunt cuprinși între valea Dunării și valea Timișului.",
  "Altitudinea maximă: 1447 m, Vf. Semenic.",
  "Roci metamorfice și calcar; relief carstic.",
  "Masive: Semenic, Almăjului, Aninei, Locvei, Dognecei.",
  "Depresiuni: Caraș-Ezeriș, Almăjului."]),
 ("Munții Poiana Ruscă", [
  "Sunt cuprinși între valea Timișului și valea Mureșului.",
  "Altitudinea maximă: 1374 m, Vf. Padeș.",
  "Roci metamorfice și calcar (și marmură); relief carstic."]),
 ("Munții Apuseni", [
  "Sunt cuprinși între valea Mureșului și valea Barcăului.",
  "Altitudinea maximă: 1849 m, Vf. Bihor (Cucurbăta Mare).",
  "Roci metamorfice, calcar și roci vulcanice, dispuse sub formă de „mozaic petrografic”.",
  "Relief carstic și vulcanic.",
  "Masive: Bihor, Zarandului, Metaliferi, Trascău, Codru-Moma, Vlădeasa, Gilău, Pădurea Craiului, Muntele Mare, Plopiș, Meseș.",
  "Depresiuni-golf (formate datorită tectonicii „în clape de pian”): Zarand, Brad, Beiuș, Vad-Borod, Zlatna.",
  "În nord, trecerea către Orientali se face printr-o serie de măguri cristaline numite „munți ascunși”."]),
]
L['dct'] = [
 ("Numele și limitele", [
  "Este numită depresiune datorită altitudinii mai joase în raport cu arcul carpatic.",
  "Este denumită colinară datorită stadiului incipient de eroziune.",
  "Limite: E, S, V – Carpații; NV – „munții ascunși”."]),
 ("Caracteristici", [
  "S-a format prin scufundarea unui compartiment carpatic, urmată de sedimentarea și ridicarea inegală a acestuia.",
  "Este formată pe roci sedimentare mai rezistente (gresii, marne, calcar) sau mai puțin rezistente (argilă, nisip, sare).",
  "Altitudinile scad de la peste 1000 m în est (1080 m, Dl. Bichiș) la sub 400 m în SV, la ieșirea Mureșului din depresiune.",
  "Datorită prezenței sării apare fenomenul de diapirism (ascensiunea sării).",
  "În regiunile cu straturi monoclinale apar dealuri asimetrice numite cueste.",
  "Zonele în care sunt prezente argilele sunt afectate de alunecări de teren."]),
 ("Subcarpații Transilvaniei", [
  "Sunt localizați în est, la contactul cu Carpații Orientali.",
  "Prezența sării a determinat diapirism, ce a dus la formarea de cute diapire.",
  "Prezintă cele mai mari altitudini, datorate și existenței unor roci mai rezistente (gresii, tuf vulcanic, marnă)."]),
 ("Depresiunile de contact", [
  "Sunt situate în sud și vest.",
  "S-au format prin eroziunea selectivă a principalelor râuri (Olt, Mureș) și a afluenților acestora.",
  "Depresiuni: Făgăraș, Sibiu, Culoarul Alba Iulia – Turda, Huedin."]),
 ("Podișul Someșan", [
  "Este situat la nord de cele două Someșe (Mic, Mare).",
  "Prezintă structură monoclinală, ce a favorizat formarea cuestelor.",
  "Înclină de la N spre S.",
  "Prezintă roci mai rezistente, dar și argilă (alunecări de teren)."]),
 ("Câmpia Transilvaniei", [
  "Este situată între Someșe și Mureș.",
  "Are aspect vălurit, altitudini de 500–600 m.",
  "Este numită câmpie datorită utilizării agricole.",
  "Prezintă domuri gazeifere."]),
 ("Podișul Târnavelor", [
  "Este situat la sud de Mureș.",
  "Înclină de la est spre vest."]),
]
TARAMURI = [
 {"id":"t1","nume":"Testul nr. 1","icon":"🥾","culoare":"#94532a",
  "niveluri":[{"id":"t1s1","titlu":"Subiectul I – alege răspunsul corect"},{"id":"t1s2","titlu":"Subiectul II – completează"},{"id":"t1s3","titlu":"Subiectele III și IV – potrivire și hartă"},{"id":"t1s4","titlu":"Subiectele V și VI – compară și explică"}]},
 {"id":"t2","nume":"Testul nr. 2","icon":"🧗","culoare":"#2d7a3e",
  "niveluri":[{"id":"t2s1","titlu":"Subiectul I – alege răspunsul corect"},{"id":"t2s2","titlu":"Subiectul II – completează"},{"id":"t2s3","titlu":"Subiectele III și IV – potrivire și hartă"},{"id":"t2s4","titlu":"Subiectele V și VI – compară și explică"}]},
]
LECTII_INDEX=[{"id":"orientali","nume":"Carpații Orientali","icon":"🏔️","culoare":"#94532a"},{"id":"meridionali","nume":"Carpații Meridionali","icon":"⛰️","culoare":"#7a4a2a"},
 {"id":"occidentali","nume":"Carpații Occidentali","icon":"🌲","culoare":"#2d7a3e"},{"id":"dct","nume":"Depresiunea Colinară a Transilvaniei","icon":"🌾","culoare":"#b8860b"}]
json.dump({"taramuri":TARAMURI,"lectii_index":LECTII_INDEX,"lectii":{k:[{"titlu":t,"puncte":p} for t,p in v] for k,v in L.items()}},open(OUT+'lectii.json','w'),ensure_ascii=False,indent=1)

def src(t, frag):
    """Returnează propoziția din lecție care conține fragmentul (verificare că sursa există)."""
    for _, pts in L[t]:
        for p in pts:
            if frag in p: return p
    raise SystemExit(f'SURSA LIPSĂ: {t}: {frag}')

# ---------------------------------------------------------------- ÎNTREBĂRI DIN TESTE: nivel + explicație
teste = json.load(open('/home/claude/tools/teste_raw.json'))
niv_test = {}

expl = {"T1-I-1":"Grupa Sudică (Carpații Curburii) are roci sedimentare: Vrancei, Buzăului, Ciucaș – flișul e o rocă sedimentară.",
 "T1-I-2":"Călimani, Gurghiu și Harghita sunt munții vulcanici ai Grupei Centrale.",
 "T1-I-3":"Sarea din Depresiunea Colinară a Transilvaniei urcă spre suprafață: acesta e diapirismul.",
 "T1-I-4":"Vf. Bihor (Cucurbăta Mare), 1849 m, e cel mai înalt din Carpații Occidentali.",
 "T1-I-5":"Podișul Târnavelor e situat la sud de Mureș.",
 "T1-II-1":"La est, Depresiunea Colinară a Transilvaniei se învecinează cu Carpații Orientali.",
 "T1-II-2":"Grupa Nordică se mai numește Carpații Maramureșului și Bucovinei.",
 "T1-II-3":"Vf. Moldoveanu (2544 m), din Munții Făgăraș, e cel mai înalt vârf din România.",
 "T1-II-4":"Oltul traversează în totalitate Carpații Meridionali; Dâmbovița și Jiul doar parțial.",
 "T1-II-5":"Straturile monoclinale (înclinate) dau dealuri asimetrice numite cueste.",
 "T1-III":"Gândește-te la fiecare grupă: unde e Bihorul, unde e Câmpia Transilvaniei, unde e Vâlcanul…",
 "T1-IV-1":"Pe hartă: A – Apuseni (10), B – Grupa Centrală (2), C – Grupa Parâng (6), D – Munții Banatului (8).",
 "T1-IV-2":"Apusenii: max. 1849 m, mozaic petrografic, relief carstic și vulcanic, depresiuni-golf.",
 "T1-IV-3":"Grupa Centrală: Călimani, Gurghiu, Harghita, Bistriței, Hășmaș, Ceahlău, Tarcău; depresiunile Giurgeu, Ciuc.",
 "T1-V":"Compară mereu „față în față”: ce au la fel și ce au diferit.",
 "T1-VI":"Depresiune = mai joasă decât Carpații din jur; colinară = relief de dealuri.",
 "T2-I-1":"Culmile Carpaților Meridionali sunt orientate E–V.",
 "T2-I-2":"Grupa Făgăraș: între Dâmbovița și Olt; Grupa Parâng: între Olt și Jiu.",
 "T2-I-3":"Câmpia Transilvaniei e între Someșe (la nord) și Mureș (la sud).",
 "T2-I-4":"Carpații Occidentali: la nord – Valea Barcăului, la sud – Valea Dunării.",
 "T2-I-5":"Un compartiment carpatic s-a scufundat, apoi s-au depus sedimente și s-a ridicat inegal.",
 "T2-II-1":"Depresiunea Loviștei aparține Grupei Făgăraș, la contactul cu Grupa Parâng.",
 "T2-II-2":"Munții Poiana Ruscă: între valea Timișului și valea Mureșului.",
 "T2-II-3":"Dl. Bichiș, 1080 m, în estul depresiunii.",
 "T2-II-4":"Fâșia vestică a Carpaților Orientali e formată din roci vulcanice.",
 "T2-II-5":"Depresiunile de contact s-au format prin eroziunea selectivă a râurilor Olt și Mureș.",
 "T2-III":"Rodnei – nord; Ciuc – centru; Beiuș – Apuseni; Cernei – Retezat-Godeanu.",
 "T2-IV-1":"Pe hartă: A – Grupa Nordică (1), B – Grupa Făgăraș (5), C – Poiana Ruscă (9), D – Retezat-Godeanu (7).",
 "T2-IV-2":"Grupa Nordică: Pietrosul Rodnei 2303 m, relief glaciar, vulcanic, depresiunile Maramureș, Dornelor, Câmpulung.",
 "T2-IV-3":"Retezat-Godeanu: Retezat, Godeanu, Mehedinți, Vâlcan, Țarcu; Depresiunea Hațeg.",
 "T2-V":"Meridionalii: înalți, masivi, glaciari. Occidentalii: joși, fragmentați, cu vulcani.",
 "T2-VI":"Sare → diapirism; straturi monoclinale → cueste; argile → alunecări; râuri → depresiuni de contact."}
for q in teste:
    q["origine"]="test"; q["nivel"]=f"t{q['test']}s"+{"I":"1","II":"2","III":"3","IV":"3","V":"4","VI":"4"}[q["subiect"]]; q["explicatie_geo"]=expl[q["id"]]
    q["dificultate"]=2
    q["lectie"]=q["taram"]; q["taram"]=f"t{q['test']}"
    if q["tip"]=="harta":
        q["itemi_harta"]=[it["nr_harta"] for it in q["itemi"]]
json.dump(teste,open(OUT+'intrebari_teste.json','w'),ensure_ascii=False,indent=1)

# Fără întrebări suplimentare: aplicația folosește doar itemii din Testul nr. 1 și nr. 2.
json.dump([],open(OUT+'intrebari_extra.json','w'))

# ---------------------------------------------------------------- INSIGNE
INS=[
 ("varful-moldoveanu","Vârful Moldoveanu","⛰️","8 răspunsuri corecte despre altitudini și vârfuri."),
 ("vulcanologul","Vulcanologul","🌋","5 răspunsuri corecte despre relieful vulcanic."),
 ("speologul","Speologul","🦇","3 răspunsuri corecte despre relieful carstic."),
 ("ghetarul","Ghețarul","🧊","3 răspunsuri corecte despre relieful glaciar."),
 ("sarea-pamantului","Sarea pământului","🧂","3 răspunsuri corecte despre diapirism și sare."),
 ("cuesta-perfecta","Cuesta perfectă","📐","3 răspunsuri corecte despre cueste și structura monoclinală."),
 ("ochi-de-cartograf","Ochi de cartograf","🗺️","3 hărți (Subiectul IV) rezolvate perfect."),
 ("comparatorul","Comparatorul","⚖️","O comparație rezolvată perfect."),
 ("maestrul-olt","Maestrul râurilor","🌊","10 răspunsuri corecte despre râuri și limite."),
 ("seria-de-foc","Seria de foc","🔥","Ai învățat 5 zile la rând."),
 ("expeditia-1","Expediția 1","🏅","Testul nr. 1 terminat cu nota cel puțin 9."),
 ("expeditia-2","Expediția 2","🏆","Testul nr. 2 terminat cu nota cel puțin 9."),
 ("primul-pas","Primul pas","👣","Primul nivel terminat."),
 ("trei-stele","Trei stele","⭐","Un nivel terminat cu 3 stele."),
 ("cartograful-complet","Toate subiectele","🧭","Cel puțin o stea în fiecare nivel al ambelor teste."),
 ("memorie-de-bufnita","Memorie de bufniță","🦉","10 flashcard-uri ajunse în cutia 5."),
]
json.dump([{"id":a,"nume":b,"icon":c,"descriere":d} for a,b,c,d in INS],open(OUT+'insigne.json','w'),ensure_ascii=False,indent=1)
