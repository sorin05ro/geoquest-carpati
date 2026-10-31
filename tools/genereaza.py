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
 {"id":"orientali","nume":"Carpații Orientali","icon":"🏔️","culoare":"#94532a",
  "niveluri":[{"id":"o1","titlu":"Poziție și limite"},{"id":"o2","titlu":"Caracteristici"},{"id":"o3","titlu":"Grupa Nordică"},{"id":"o4","titlu":"Grupa Centrală"},{"id":"o5","titlu":"Grupa Sudică"},{"id":"o6","titlu":"Hartă și recapitulare"}]},
 {"id":"meridionali","nume":"Carpații Meridionali","icon":"⛰️","culoare":"#7a4a2a",
  "niveluri":[{"id":"m1","titlu":"Limite și caracteristici"},{"id":"m2","titlu":"Grupele Bucegi și Făgăraș"},{"id":"m3","titlu":"Grupele Parâng și Retezat-Godeanu"},{"id":"m4","titlu":"Vârfuri și râuri"},{"id":"m5","titlu":"Hartă și recapitulare"}]},
 {"id":"occidentali","nume":"Carpații Occidentali","icon":"🌲","culoare":"#2d7a3e",
  "niveluri":[{"id":"c1","titlu":"Limite și caracteristici"},{"id":"c2","titlu":"Banat și Poiana Ruscă"},{"id":"c3","titlu":"Munții Apuseni"},{"id":"c4","titlu":"Hartă și recapitulare"}]},
 {"id":"dct","nume":"Depresiunea Colinară a Transilvaniei","icon":"🌾","culoare":"#b8860b",
  "niveluri":[{"id":"d1","titlu":"Nume, limite, formare"},{"id":"d2","titlu":"Roci și fenomene"},{"id":"d3","titlu":"Diviziunile"},{"id":"d4","titlu":"Hartă și recapitulare"}]},
]
json.dump({"taramuri":TARAMURI,"lectii":{k:[{"titlu":t,"puncte":p} for t,p in v] for k,v in L.items()}},open(OUT+'lectii.json','w'),ensure_ascii=False,indent=1)

def src(t, frag):
    """Returnează propoziția din lecție care conține fragmentul (verificare că sursa există)."""
    for _, pts in L[t]:
        for p in pts:
            if frag in p: return p
    raise SystemExit(f'SURSA LIPSĂ: {t}: {frag}')

# ---------------------------------------------------------------- ÎNTREBĂRI DIN TESTE: nivel + explicație
teste = json.load(open('/home/claude/tools/teste_raw.json'))
niv_test = {"T1-I-1":"o5","T1-I-2":"o4","T1-I-3":"d2","T1-I-4":"c3","T1-I-5":"d3","T1-II-1":"d1","T1-II-2":"o3","T1-II-3":"m4","T1-II-4":"m4","T1-II-5":"d2",
 "T1-III":"o6","T1-IV-1":"o6","T1-IV-2":"c3","T1-IV-3":"o4","T1-V":"m5","T1-VI":"d1",
 "T2-I-1":"m1","T2-I-2":"m2","T2-I-3":"d3","T2-I-4":"c1","T2-I-5":"d1","T2-II-1":"m2","T2-II-2":"c2","T2-II-3":"d2","T2-II-4":"o2","T2-II-5":"d3",
 "T2-III":"c4","T2-IV-1":"m5","T2-IV-2":"o3","T2-IV-3":"m3","T2-V":"c4","T2-VI":"d4"}
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
    q["origine"]="test"; q["nivel"]=niv_test[q["id"]]; q["explicatie_geo"]=expl[q["id"]]
    q["dificultate"]=2
    if q["taram"]=="mixt": q["taram"]={"o":"orientali","m":"meridionali","c":"occidentali","d":"dct"}[q["nivel"][0]]
    if q["tip"]=="harta":
        q["itemi_harta"]=[it["nr_harta"] for it in q["itemi"]]
json.dump(teste,open(OUT+'intrebari_teste.json','w'),ensure_ascii=False,indent=1)

# ---------------------------------------------------------------- ÎNTREBĂRI SUPLIMENTARE
X=[]; cnt={}
def add(taram,nivel,tip,enunt,sursa,expl,dif=1,**kw):
    cnt[taram]=cnt.get(taram,0)+1
    q={"id":f"X-{taram[:3].upper()}-{cnt[taram]:03d}","origine":"lectie","taram":taram,"nivel":nivel,"tip":tip,"dificultate":dif,"enunt":enunt,"explicatie_geo":expl,"sursa":sursa}
    q.update(kw); X.append(q); return q
def grila(t,n,enunt,corect,gresite,frag,expl,dif=1):
    v=[corect]+list(gresite); random.shuffle(v)
    return add(t,n,"grila",enunt,src(t,frag),expl,dif,variante=v,corect=v.index(corect))
def compl(t,n,enunt,acc,frag,expl,dif=2):
    return add(t,n,"completare",enunt,src(t,frag),expl,dif,raspunsuri_acceptate=acc)
def af(t,n,afirm,adev,frag,expl,dif=1):
    return add(t,n,"adevarat_fals",afirm,src(t,frag),expl,dif,adevarat=adev)

# --- Orientali
O='orientali'
grila(O,'o1',"Carpații Orientali sunt situați în ……… Depresiunii Colinare a Transilvaniei.","estul",["vestul","sudul","nordul"],"în estul Depresiunii","Carpații Orientali sunt la est de Depresiunea Colinară a Transilvaniei.")
grila(O,'o1',"Limita de nord a Carpaților Orientali este:","granița cu Ucraina",["Valea Prahovei","Pasul Oituz","valea Moldovei"],"granița cu Ucraina (la nord)","La nord, Carpații Orientali ajung până la granița cu Ucraina.")
grila(O,'o1',"Limita de sud-vest a Carpaților Orientali este:","Valea Prahovei",["Valea Oltului","Valea Jiului","Culoarul Timiș–Cerna"],"Valea Prahovei (la sud-vest)","Prahova separă Carpații Orientali de Carpații Meridionali.")
grila(O,'o1',"Ce diferență de altitudine există între Carpații Orientali și Podișul Moldovei?","700–1000 m",["100–200 m","2000–2500 m","300–400 m"],"700–1000 m","La est, Orientalii domină Podișul Moldovei cu 700–1000 m.",2)
af(O,'o1',"La sud-vest, Carpații Orientali sunt dominați de înălțimile de peste 2000 m ale Carpaților Meridionali.",True,"dominați de înălțimile","Corect: Meridionalii sunt mai înalți.")
af(O,'o1',"La vest de Carpații Orientali se află Podișul Moldovei.",False,"La est domină","Podișul Moldovei e la EST; la vest e Depresiunea Colinară a Transilvaniei.")
compl(O,'o1',"La sud, Carpații Orientali se învecinează cu Subcarpații ……",["Curburii"],"La sud se află Subcarpații Curburii","La sud sunt Subcarpații Curburii.")
grila(O,'o2',"Înălțimea medie a Carpaților Orientali este de circa:","1300 m",["640 m","1150 m","2000 m"],"circa 1300 m","Orientalii au înălțimi mijlocii, circa 1300 m.")
grila(O,'o2',"Culmile Carpaților Orientali sunt orientate în cea mai mare parte:","NV–SE",["E–V","N–S","NE–SV"],"orientate în cea mai mare parte NV–SE","Șirurile paralele de culmi merg NV–SE.")
grila(O,'o2',"În centrul Carpaților Orientali predomină:","șisturile cristaline",["rocile vulcanice","rocile sedimentare cutate","sarea"],"șisturi cristaline (în centru)","Vest – vulcanice, centru – cristaline, est și sud – sedimentare.")
grila(O,'o2',"Rocile sedimentare cutate din Carpații Orientali se află:","la est și sud",["în vest","în centru","doar în nord"],"roci sedimentare cutate (la est și sud)","Fâșia sedimentară e la est și sud.",2)
af(O,'o2',"Carpații Orientali au o fragmentare accentuată, cu depresiuni largi.",True,"Fragmentarea este accentuată","Corect: Maramureș, Giurgeu, Ciuc sunt depresiuni largi.")
af(O,'o2',"Relieful glaciar apare cel mai bine în Munții Rodnei.",True,"Rodnei","Da, Rodnei au cel mai bine dezvoltat relief glaciar din Orientali.")
af(O,'o2',"Carpații Orientali trec frecvent de 2000 m altitudine.",False,"rar trecând de 1800 m","Rar trec de 1800 m; doar câteva vârfuri depășesc 2000 m.")
compl(O,'o2',"De la sud de Valea ……, culmile Carpaților Orientali se curbează spre SV.",["Trotușului","Trotuș"],"Trotușului","Curbura începe la sud de Valea Trotușului.",3)
# grupe orientali
grila(O,'o3',"Cel mai înalt vârf al Carpaților Orientali este:","Vf. Pietrosul Rodnei (2303 m)",["Vf. Pietrosul Călimanilor (2100 m)","Vf. Ciucaș (1954 m)","Vf. Moldoveanu (2544 m)"],"2303 m","Pietrosul Rodnei, 2303 m, în Munții Rodnei.")
grila(O,'o3',"Munții vulcanici ai Grupei Nordice sunt:","Oaș, Gutâi, Țibleș, Bârgău",["Călimani, Gurghiu, Harghita","Vrancei, Buzăului, Ciucaș","Rodnei, Suhard, Maramureșului"],"Roci vulcanice: Oaș","Oaș, Gutâi, Țibleș, Bârgău – lanțul vulcanic din nord.",2)
grila(O,'o3',"Care dintre depresiuni NU aparține Grupei Nordice?","Depresiunea Ciuc",["Depresiunea Maramureșului","Depresiunea Dornelor","Depresiunea Câmpulung"],"Depresiuni: Maramureșului, Dornelor, Câmpulung","Ciuc aparține Grupei Centrale.",2)
grila(O,'o3',"Munții Rodnei sunt alcătuiți din roci:","metamorfice",["vulcanice","sedimentare","sare"],"Roci metamorfice: Maramureșului, Rodnei","Rodnei sunt munți din roci metamorfice (cristaline).")
grila(O,'o3',"Obcina Feredeu și Obcina Mare sunt alcătuite din roci:","sedimentare",["vulcanice","metamorfice","calcar și marmură"],"Roci sedimentare: Obcina Feredeu","Obcinele Feredeu și Mare – roci sedimentare.",2)
compl(O,'o3',"Limita sudică a Grupei Nordice: Depr. Dornelor – Pasul …… – valea Moldovei.",["Mestecăniș"],"Pasul Mestecăniș","Pasul Mestecăniș face parte din limita dintre Grupa Nordică și cea Centrală.",3)
af(O,'o3',"În Grupa Nordică întâlnim relief vulcanic, glaciar și carstic.",True,"vulcanic, glaciar, carstic","Corect: toate trei tipurile.")
grila(O,'o4',"Altitudinea maximă a Grupei Centrale este:","2100 m – Vf. Pietrosul Călimanilor",["2303 m – Vf. Pietrosul Rodnei","1954 m – Vf. Ciucaș","2544 m – Vf. Moldoveanu"],"2100 m","Pietrosul Călimanilor, 2100 m.")
grila(O,'o4',"Limita sudică a Grupei Centrale este:","Pasul Oituz – valea Oituzului",["Valea Prahovei","Pasul Mestecăniș","Valea Dunării"],"S – Pasul Oituz","Oituzul separă Grupa Centrală de Grupa Sudică.")
grila(O,'o4',"Munții Ceahlău sunt alcătuiți din roci:","sedimentare",["vulcanice","metamorfice","doar calcar"],"Roci sedimentare: Stânișoarei, Tarcău, Ceahlău","Stânișoarei, Tarcău, Ceahlău – roci sedimentare.",2)
grila(O,'o4',"Munții Bistriței, Giurgeu și Hășmaș sunt alcătuiți din roci:","metamorfice",["vulcanice","sedimentare","sare"],"Roci metamorfice: Bistriței","Fâșia centrală – roci metamorfice.",2)
grila(O,'o4',"Tipurile de relief din Grupa Centrală sunt:","vulcanic și carstic",["glaciar și vulcanic","doar glaciar","pe conglomerate"],"Tipuri de relief: vulcanic, carstic","În Grupa Centrală – relief vulcanic și carstic.",2)
compl(O,'o4',"Depresiunile Grupei Centrale: Giurgeu, Ciuc și ……",["Comănești"],"Depresiuni: Giurgeu, Ciuc, Comănești","Giurgeu, Ciuc, Comănești.")
grila(O,'o5',"Altitudinea maximă a Carpaților Curburii este:","1954 m – Vf. Ciucaș",["2100 m – Vf. Pietrosul Călimanilor","2505 m – Vf. Omu","1849 m – Vf. Bihor"],"1954 m","Vf. Ciucaș, 1954 m.")
grila(O,'o5',"Depresiunea din Grupa Sudică a Carpaților Orientali este:","Depresiunea Brașov",["Depresiunea Ciuc","Depresiunea Loviștei","Depresiunea Hațeg"],"Depresiunea Brașov","Depresiunea Brașov e în Carpații Curburii.")
grila(O,'o5',"Limita vestică a Grupei Sudice este:","valea Prahovei",["valea Oltului","Pasul Oituz","valea Trotușului"],"V – valea Prahovei","Prahova e limita vestică.")
af(O,'o5',"Munții Vrancei, Buzăului și Ciucaș sunt alcătuiți din roci vulcanice.",False,"Roci sedimentare: Vrancei","Sunt alcătuiți din roci sedimentare.")
af(O,'o5',"În Carpații Curburii predomină relieful carstic.",True,"Tip de relief: carstic","Corect, conform lecției.")
# potriviri / ordonări / cine sunt
add(O,'o6',"potrivire","Asociază depresiunea cu grupa Carpaților Orientali.",src(O,"Depresiuni: Maramureșului"),"Nord: Maramureș, Dornelor; centru: Ciuc, Giurgeu; sud: Brașov.",2,
    coloanaA=["Depresiunea Maramureșului","Depresiunea Ciuc","Depresiunea Brașov","Depresiunea Comănești"],coloanaB=["Grupa Nordică","Grupa Centrală","Grupa Sudică"],perechi={"0":0,"1":1,"2":2,"3":1},distractor=[])
add(O,'o6',"potrivire","Asociază munții cu tipul de rocă.",src(O,"Roci vulcanice: Călimani"),"Vulcanice – vest; metamorfice – centru; sedimentare – est și sud.",2,
    coloanaA=["Munții Harghita","Munții Hășmaș","Munții Tarcău","Munții Gutâi"],coloanaB=["roci vulcanice","roci metamorfice","roci sedimentare"],perechi={"0":0,"1":1,"2":2,"3":0},distractor=[])
add(O,'o6',"ordonare","Ordonează grupele Carpaților Orientali de la nord la sud.",src(O,"Limite: N – granița cu Ucraina; S"),"Nordică → Centrală → Sudică.",1,elemente=["Grupa Nordică","Grupa Centrală","Grupa Sudică"])
add(O,'o6',"ordonare","Ordonează vârfurile descrescător, după altitudine.",src(O,"2303 m"),"2303 > 2100 > 1954.",1,elemente=["Pietrosul Rodnei (2303 m)","Pietrosul Călimanilor (2100 m)","Ciucaș (1954 m)"])
add(O,'o6',"ordonare","Ordonează fâșiile de roci ale Carpaților Orientali de la vest la est.",src(O,"roci vulcanice (în vest)"),"Vest: vulcanice → centru: cristaline → est: sedimentare.",2,elemente=["roci vulcanice","șisturi cristaline","roci sedimentare cutate"])
add(O,'o3',"cine_sunt","Cine sunt eu?",src(O,"2303 m, Vf. Pietrosul Rodnei"),"Grupa Nordică – Carpații Maramureșului și Bucovinei.",2,
    indicii=["Am munți vulcanici: Oaș, Gutâi, Țibleș.","Am Depresiunea Maramureșului.","Aici e Vf. Pietrosul Rodnei, 2303 m."],raspuns="Grupa Nordică a Carpaților Orientali",variante=["Grupa Nordică a Carpaților Orientali","Grupa Centrală a Carpaților Orientali","Grupa Sudică a Carpaților Orientali","Grupa Făgăraș"])
add(O,'o4',"cine_sunt","Cine sunt eu?",src(O,"2100 m, Vf. Pietrosul Călimanilor"),"Grupa Centrală – Carpații Moldo-Transilvani.",2,
    indicii=["Am cel mai lung lanț vulcanic: Călimani, Gurghiu, Harghita.","Am depresiunile Giurgeu și Ciuc.","La sud mă opresc la Pasul Oituz."],raspuns="Grupa Centrală a Carpaților Orientali",variante=["Grupa Nordică a Carpaților Orientali","Grupa Centrală a Carpaților Orientali","Grupa Sudică a Carpaților Orientali","Munții Apuseni"])
add(O,'o5',"cine_sunt","Cine sunt eu?",src(O,"1954 m, Vf. Ciucaș"),"Grupa Sudică – Carpații Curburii.",2,
    indicii=["Sunt alcătuită din roci sedimentare.","Am Depresiunea Brașov.","Vârful meu cel mai înalt e Ciucaș, 1954 m."],raspuns="Grupa Sudică a Carpaților Orientali",variante=["Grupa Sudică a Carpaților Orientali","Grupa Bucegi","Grupa Centrală a Carpaților Orientali","Munții Banatului"])

# --- Meridionali
M='meridionali'
grila(M,'m1',"Carpații Meridionali mai sunt numiți și:","Alpii Transilvaniei",["Munții Ascunși","Carpații Curburii","Carpații Moldo-Transilvani"],"Alpii Transilvaniei","Fiind cei mai înalți, sunt numiți „Alpii Transilvaniei”.")
grila(M,'m1',"Limita estică a Carpaților Meridionali este:","Valea Prahovei",["Valea Oltului","Culoarul Timiș–Cerna","Valea Jiului"],"E – Valea Prahovei","Prahova – la est.")
grila(M,'m1',"Limita vestică a Carpaților Meridionali este:","Culoarul Timiș–Cerna",["Valea Prahovei","Valea Barcăului","Valea Dunării"],"V – Culoarul Timiș–Cerna","Culoarul Timiș–Cerna – la vest.")
grila(M,'m1',"Carpații Meridionali s-au format prin:","încrețire, în timpul orogenezei alpine",["erupții vulcanice","scufundarea unui compartiment","acțiunea vântului"],"orogenezei alpine","Încrețire – orogeneza alpină.")
grila(M,'m1',"Altitudinea medie a Carpaților Meridionali este:","1150 m",["640 m","1300 m","2544 m"],"altitudinea medie este de 1150 m","1150 m – cea mai mare medie din Carpații românești.",2)
grila(M,'m1',"Rocile care apar pe scară largă în Carpații Meridionali sunt:","rocile metamorfice",["rocile vulcanice","sarea","argila"],"roci metamorfice pe scară largă","Predomină rocile metamorfice (șisturi cristaline).")
af(M,'m1',"Carpații Meridionali prezintă masivitate accentuată, datorată durității rocilor.",True,"masivitate accentuată","Corect.")
af(M,'m1',"În Carpații Meridionali întâlnim relief vulcanic.",False,"Tipuri de relief: glaciar, carstic, pe conglomerate","Meridionalii au relief glaciar, carstic și pe conglomerate – nu vulcanic.")
compl(M,'m1',"La sud, Carpații Meridionali se învecinează cu Subcarpații Curburii și Getici și cu Podișul ……",["Mehedinți"],"Podișul Mehedinți","Podișul Mehedinți.",3)
grila(M,'m2',"Grupa Bucegi este cuprinsă între:","valea Prahovei și valea Dâmboviței",["valea Dâmboviței și valea Oltului","valea Oltului și valea Jiului","valea Jiului și Culoarul Timiș–Cerna"],"între valea Prahovei și valea Dâmboviței","Bucegi: Prahova – Dâmbovița.")
grila(M,'m2',"Grupa Făgăraș este cuprinsă între:","valea Dâmboviței și valea Oltului",["valea Prahovei și valea Dâmboviței","valea Oltului și valea Jiului","valea Mureșului și valea Barcăului"],"între valea Dâmboviței și valea Oltului","Făgăraș: Dâmbovița – Olt.")
grila(M,'m2',"Vf. Omu (2505 m) se află în grupa:","Bucegi",["Făgăraș","Parâng","Retezat-Godeanu"],"2505 m, Vf. Omu","Omu e cel mai înalt vârf al Grupei Bucegi.")
grila(M,'m2',"Munții Bucegi sunt alcătuiți din:","conglomerate",["calcar","roci vulcanice","sare"],"conglomerate (Bucegi)","Bucegi – conglomerate; Piatra Craiului – calcar; Leaota – șisturi cristaline.",2)
grila(M,'m2',"Piatra Craiului este alcătuită din:","calcar",["conglomerate","roci vulcanice","șisturi cristaline"],"calcar (Piatra Craiului)","Piatra Craiului – calcar.",2)
compl(M,'m2',"Culoarul depresionar din Grupa Bucegi se numește Rucăr – ……",["Bran"],"Rucăr – Bran","Culoarul Rucăr – Bran.")
grila(M,'m2',"Care munți NU aparțin Grupei Făgăraș?","Munții Șureanu",["Munții Cozia","Munții Iezer","Munții Ghițu"],"Șisturi cristaline (Făgăraș, Cozia","Șureanu aparțin Grupei Parâng.",2)
af(M,'m2',"Grupa Făgăraș prezintă relief carstic și glaciar.",True,"Relief carstic și glaciar","Corect.")
grila(M,'m3',"Grupa Parâng este cuprinsă între:","valea Oltului și valea Jiului",["valea Dâmboviței și valea Oltului","valea Jiului și Culoarul Timiș–Cerna","valea Prahovei și valea Dâmboviței"],"între valea Oltului și valea Jiului","Parâng: Olt – Jiu.")
grila(M,'m3',"Altitudinea maximă a Grupei Parâng este:","2519 m – Vf. Parângul Mare",["2509 m – Vf. Peleaga","2505 m – Vf. Omu","2544 m – Vf. Moldoveanu"],"2519 m","Parângul Mare, 2519 m.")
grila(M,'m3',"Depresiunea Petroșani aparține grupei:","Parâng",["Retezat-Godeanu","Făgăraș","Bucegi"],"Depresiunea Petroșani","Petroșani – Grupa Parâng.")
grila(M,'m3',"Vf. Peleaga (2509 m) se află în grupa:","Retezat-Godeanu",["Parâng","Făgăraș","Bucegi"],"2509 m, Vf. Peleaga","Peleaga – cel mai înalt din Retezat-Godeanu.")
grila(M,'m3',"Depresiunea Hațeg aparține grupei:","Retezat-Godeanu",["Parâng","Făgăraș","Bucegi"],"Depresiunea Hațeg","Hațeg – Grupa Retezat-Godeanu.")
grila(M,'m3',"Grupa Retezat-Godeanu este cuprinsă între:","valea Jiului și Culoarul Timiș–Cerna",["valea Oltului și valea Jiului","valea Prahovei și valea Dâmboviței","valea Mureșului și valea Barcăului"],"între valea Jiului și culoarul Timiș–Cerna","Retezat-Godeanu: Jiu – Timiș–Cerna.")
grila(M,'m3',"Care munți aparțin Grupei Parâng?","Munții Lotrului",["Munții Țarcu","Munții Iezer","Munții Leaota"],"Lotrului","Parâng, Șureanu, Căpățânii, Lotrului.",2)
compl(M,'m3',"Munții Retezat, Godeanu, Mehedinți, Vâlcan și …… aparțin Grupei Retezat-Godeanu.",["Țarcu"],"Țarcu","Al cincilea masiv din listă e Țarcu.",3)
grila(M,'m4',"Râul care traversează în totalitate Carpații Meridionali este:","Oltul",["Dâmbovița","Jiul","Prahova"],"în totalitate de Olt","Oltul îi traversează complet; Dâmbovița și Jiul – parțial.")
af(M,'m4',"Jiul traversează Carpații Meridionali în totalitate.",False,"traversați parțial de Dâmbovița și Jiu","Jiul și Dâmbovița îi traversează doar parțial.")
compl(M,'m4',"Cel mai înalt vârf din Grupa Făgăraș (și din România) este Vf. ……",["Moldoveanu"],"2544 m, Vf. Moldoveanu","Vf. Moldoveanu, 2544 m.",1)
add(M,'m4',"ordonare","Ordonează vârfurile descrescător, după altitudine.",src(M,"2544 m"),"Moldoveanu 2544 > Parângul Mare 2519 > Peleaga 2509 > Omu 2505.",2,elemente=["Moldoveanu (2544 m)","Parângul Mare (2519 m)","Peleaga (2509 m)","Omu (2505 m)"])
add(M,'m4',"ordonare","Ordonează grupele Carpaților Meridionali de la est la vest.",src(M,"între valea Prahovei"),"Bucegi → Făgăraș → Parâng → Retezat-Godeanu.",1,elemente=["Grupa Bucegi","Grupa Făgăraș","Grupa Parâng","Grupa Retezat-Godeanu"])
add(M,'m4',"ordonare","Ordonează râurile-limită ale Carpaților Meridionali de la est la vest.",src(M,"între valea Prahovei"),"Prahova → Dâmbovița → Olt → Jiu → Timiș–Cerna.",2,elemente=["Prahova","Dâmbovița","Olt","Jiu","Timiș–Cerna"])
add(M,'m4',"potrivire","Asociază vârful cu grupa.",src(M,"2509 m, Vf. Peleaga"),"Omu – Bucegi; Moldoveanu – Făgăraș; Parângul Mare – Parâng; Peleaga – Retezat-Godeanu.",2,
    coloanaA=["Vf. Omu","Vf. Moldoveanu","Vf. Parângul Mare","Vf. Peleaga"],coloanaB=["Grupa Bucegi","Grupa Făgăraș","Grupa Parâng","Grupa Retezat-Godeanu"],perechi={"0":0,"1":1,"2":2,"3":3},distractor=[])
add(M,'m4',"potrivire","Asociază depresiunea cu grupa.",src(M,"Depresiunea Loviștei"),"Rucăr–Bran – Bucegi; Loviștei – Făgăraș; Petroșani – Parâng; Hațeg – Retezat-Godeanu.",2,
    coloanaA=["Culoarul Rucăr – Bran","Depresiunea Loviștei","Depresiunea Petroșani","Depresiunea Hațeg"],coloanaB=["Grupa Bucegi","Grupa Făgăraș","Grupa Parâng","Grupa Retezat-Godeanu"],perechi={"0":0,"1":1,"2":2,"3":3},distractor=[])
add(M,'m2',"cine_sunt","Cine sunt eu?",src(M,"2544 m, Vf. Moldoveanu"),"Grupa Făgăraș.",2,
    indicii=["Sunt cuprinsă între Dâmbovița și Olt.","Am Depresiunea Loviștei.","Aici e cel mai înalt vârf din țară."],raspuns="Grupa Făgăraș",variante=["Grupa Făgăraș","Grupa Bucegi","Grupa Parâng","Grupa Retezat-Godeanu"])
add(M,'m2',"cine_sunt","Cine sunt eu?",src(M,"2505 m, Vf. Omu"),"Grupa Bucegi.",2,
    indicii=["Am munți din conglomerate și calcar.","Am culoarul Rucăr – Bran.","Vârful meu cel mai înalt e Omu."],raspuns="Grupa Bucegi",variante=["Grupa Bucegi","Grupa Făgăraș","Grupa Sudică a Carpaților Orientali","Grupa Parâng"])
add(M,'m3',"cine_sunt","Cine sunt eu?",src(M,"Depresiunea Hațeg"),"Grupa Retezat-Godeanu.",2,
    indicii=["Sunt cea mai vestică grupă a Meridionalilor.","Am munții Vâlcan, Țarcu, Mehedinți.","Am Depresiunea Hațeg și Vf. Peleaga."],raspuns="Grupa Retezat-Godeanu",variante=["Grupa Retezat-Godeanu","Grupa Parâng","Munții Banatului","Munții Poiana Ruscă"])
add(M,'m3',"cine_sunt","Cine sunt eu?",src(M,"2519 m, Vf. Parângul Mare"),"Grupa Parâng.",2,
    indicii=["Sunt între Olt și Jiu.","Am munții Șureanu, Căpățânii, Lotrului.","Am Depresiunea Petroșani."],raspuns="Grupa Parâng",variante=["Grupa Parâng","Grupa Făgăraș","Grupa Retezat-Godeanu","Grupa Bucegi"])

# --- Occidentali
C='occidentali'
grila(C,'c1',"Carpații Occidentali reprezintă:","cea mai joasă și mai fragmentată unitate carpatică",["cea mai înaltă unitate carpatică","o unitate formată doar din roci vulcanice","o depresiune colinară"],"cea mai joasă și mai fragmentată","Sunt cei mai joși și mai fragmentați Carpați.")
grila(C,'c1',"Limita sudică a Carpaților Occidentali este:","Valea Dunării",["Valea Barcăului","Valea Mureșului","Valea Prahovei"],"S – Valea Dunării","Dunărea – la sud.")
grila(C,'c1',"Altitudinea medie a Carpaților Occidentali este:","640 m",["1150 m","1300 m","1849 m"],"altitudinea medie este de 640 m","640 m – cea mai mică medie dintre Carpați.",2)
grila(C,'c1',"Altitudinea maximă a Carpaților Occidentali este:","1849 m – Vf. Bihor",["1447 m – Vf. Semenic","1374 m – Vf. Padeș","2544 m – Vf. Moldoveanu"],"1849 m, în Vf. Bihor","Vf. Bihor, 1849 m.")
grila(C,'c1',"Tipurile de relief specifice Carpaților Occidentali sunt:","carstic și vulcanic",["glaciar și vulcanic","doar glaciar","pe conglomerate și glaciar"],"Prezintă relief carstic și vulcanic","Relief carstic și vulcanic.")
af(C,'c1',"Carpații Occidentali sunt alcătuiți din roci metamorfice, sedimentare și vulcanice.",True,"Prezintă roci metamorfice, sedimentare, vulcanice","Corect.")
af(C,'c1',"La vest, Carpații Occidentali se învecinează cu Depresiunea Transilvaniei.",False,"V – Câmpia și Dealurile de Vest","La vest sunt Câmpia și Dealurile de Vest; Depresiunea Transilvaniei e la est.")
compl(C,'c1',"Limita nordică a Carpaților Occidentali este Valea ……",["Barcăului","Barcău"],"N – Valea Barcăului","Valea Barcăului.")
grila(C,'c2',"Munții Banatului sunt cuprinși între:","valea Dunării și valea Timișului",["valea Timișului și valea Mureșului","valea Mureșului și valea Barcăului","valea Jiului și valea Oltului"],"între valea Dunării și valea Timișului","Banat: Dunăre – Timiș.")
grila(C,'c2',"Altitudinea maximă a Munților Banatului este:","1447 m – Vf. Semenic",["1374 m – Vf. Padeș","1849 m – Vf. Bihor","1954 m – Vf. Ciucaș"],"1447 m, Vf. Semenic","Vf. Semenic, 1447 m.")
grila(C,'c2',"Munții Poiana Ruscă sunt cuprinși între:","valea Timișului și valea Mureșului",["valea Dunării și valea Timișului","valea Mureșului și valea Barcăului","valea Oltului și valea Jiului"],"între valea Timișului și valea Mureșului","Poiana Ruscă: Timiș – Mureș.")
grila(C,'c2',"Altitudinea maximă a Munților Poiana Ruscă este:","1374 m – Vf. Padeș",["1447 m – Vf. Semenic","1849 m – Vf. Bihor","1080 m – Dl. Bichiș"],"1374 m, Vf. Padeș","Vf. Padeș, 1374 m.")
grila(C,'c2',"Care masiv NU aparține Munților Banatului?","Vlădeasa",["Semenic","Aninei","Locvei"],"Masive: Semenic, Almăjului","Vlădeasa aparține Munților Apuseni.",2)
compl(C,'c2',"Depresiunile din Munții Banatului sunt Caraș-Ezeriș și ……",["Almăjului","Almăj"],"Depresiuni: Caraș-Ezeriș, Almăjului","Depresiunea Almăjului.",2)
af(C,'c2',"În Munții Poiana Ruscă apare și marmura.",True,"și marmură","Corect – roci metamorfice și calcar, și marmură.")
grila(C,'c3',"Munții Apuseni sunt cuprinși între:","valea Mureșului și valea Barcăului",["valea Timișului și valea Mureșului","valea Dunării și valea Timișului","valea Someșului și valea Barcăului"],"între valea Mureșului și valea Barcăului","Apuseni: Mureș – Barcău.")
grila(C,'c3',"Cum se numește modul de dispunere a rocilor în Munții Apuseni?","mozaic petrografic",["fâșii paralele","structură monoclinală","cute diapire"],"mozaic petrografic","Rocile diferite alcătuiesc un „mozaic petrografic”.",2)
grila(C,'c3',"Depresiunile-golf din Munții Apuseni s-au format datorită:","tectonicii „în clape de pian”",["eroziunii glaciare","diapirismului","erupțiilor vulcanice"],"clape de pian","Tectonica „în clape de pian” a format depresiunile-golf.",3)
grila(C,'c3',"Care este o depresiune-golf din Munții Apuseni?","Depresiunea Beiuș",["Depresiunea Hațeg","Depresiunea Ciuc","Depresiunea Loviștei"],"Zarand, Brad, Beiuș","Zarand, Brad, Beiuș, Vad-Borod, Zlatna.")
grila(C,'c3',"Trecerea de la Apuseni spre Carpații Orientali se face prin:","„munții ascunși” (măguri cristaline)",["Culoarul Timiș–Cerna","Pasul Oituz","Valea Prahovei"],"munți ascunși","În nord, „munții ascunși” fac trecerea spre Orientali.",2)
grila(C,'c3',"Care masiv aparține Munților Apuseni?","Munții Metaliferi",["Munții Semenic","Munții Țarcu","Munții Gurghiu"],"Masive: Bihor, Zarandului, Metaliferi","Metaliferi sunt în Apuseni.")
compl(C,'c3',"Cel mai înalt vârf al Munților Apuseni este Vf. Bihor, numit și ……",["Cucurbăta Mare","Curcubăta Mare"],"Cucurbăta Mare","Vf. Bihor (Cucurbăta Mare), 1849 m.",3)
af(C,'c3',"Munții Apuseni prezintă relief carstic și vulcanic.",True,"Relief carstic și vulcanic","Corect.")
add(C,'c4',"ordonare","Ordonează diviziunile Carpaților Occidentali de la sud la nord.",src(C,"între valea Dunării și valea Timișului"),"Banat → Poiana Ruscă → Apuseni.",1,elemente=["Munții Banatului","Munții Poiana Ruscă","Munții Apuseni"])
add(C,'c4',"ordonare","Ordonează vârfurile descrescător, după altitudine.",src(C,"1849 m"),"Bihor 1849 > Semenic 1447 > Padeș 1374.",1,elemente=["Vf. Bihor (1849 m)","Vf. Semenic (1447 m)","Vf. Padeș (1374 m)"])
add(C,'c4',"potrivire","Asociază masivul cu diviziunea Carpaților Occidentali.",src(C,"Masive: Bihor, Zarandului"),"Semenic, Aninei – Banat; Trascău, Gilău – Apuseni.",2,
    coloanaA=["Semenic","Trascău","Aninei","Gilău"],coloanaB=["Munții Banatului","Munții Poiana Ruscă","Munții Apuseni"],perechi={"0":0,"1":2,"2":0,"3":2},distractor=[1])
add(C,'c3',"cine_sunt","Cine sunt eu?",src(C,"mozaic petrografic"),"Munții Apuseni.",2,
    indicii=["Am depresiuni-golf: Zarand, Beiuș, Brad.","Rocile mele formează un „mozaic petrografic”.","Am cel mai înalt vârf din Carpații Occidentali."],raspuns="Munții Apuseni",variante=["Munții Apuseni","Munții Banatului","Munții Poiana Ruscă","Grupa Retezat-Godeanu"])
add(C,'c2',"cine_sunt","Cine sunt eu?",src(C,"1447 m, Vf. Semenic"),"Munții Banatului.",2,
    indicii=["Sunt între Dunăre și Timiș.","Am masivele Aninei și Locvei.","Vârful meu cel mai înalt e Semenic."],raspuns="Munții Banatului",variante=["Munții Banatului","Munții Poiana Ruscă","Munții Apuseni","Grupa Retezat-Godeanu"])
add(C,'c2',"cine_sunt","Cine sunt eu?",src(C,"1374 m, Vf. Padeș"),"Munții Poiana Ruscă.",2,
    indicii=["Sunt între Timiș și Mureș.","Am și marmură.","Vârful meu cel mai înalt e Padeș."],raspuns="Munții Poiana Ruscă",variante=["Munții Poiana Ruscă","Munții Banatului","Munții Apuseni","Grupa Parâng"])

# --- DCT
D='dct'
grila(D,'d1',"Depresiunea Colinară a Transilvaniei este numită „depresiune” deoarece:","are altitudini mai joase decât arcul carpatic",["e acoperită de lacuri","s-a format prin erupții","are cele mai mari altitudini"],"altitudinii mai joase în raport cu arcul carpatic","Depresiune = mai joasă decât munții din jur.")
grila(D,'d1',"Depresiunea Colinară a Transilvaniei este numită „colinară” datorită:","stadiului incipient de eroziune",["prezenței ghețarilor","prezenței vulcanilor","culmilor orientate E–V"],"stadiului incipient de eroziune","Colinară – conform lecției, datorită stadiului incipient de eroziune.",2)
grila(D,'d1',"La nord-vest, Depresiunea Colinară a Transilvaniei este limitată de:","„munții ascunși”",["Carpații Meridionali","Valea Prahovei","Dunăre"],"NV – „munții","NV – „munții ascunși”.")
af(D,'d1',"Depresiunea Colinară a Transilvaniei este înconjurată de Carpați la est, sud și vest.",True,"E, S, V – Carpații","Corect.")
compl(D,'d1',"Depresiunea Colinară a Transilvaniei s-a format prin scufundarea unui compartiment ……",["carpatic"],"scufundarea unui compartiment carpatic","Un compartiment carpatic s-a scufundat.",2)
grila(D,'d2',"Care rocă din Depresiunea Colinară a Transilvaniei este mai puțin rezistentă?","argila",["gresia","marna","calcarul"],"mai puțin rezistente (argilă, nisip, sare)","Argila, nisipul și sarea sunt mai puțin rezistente.",2)
grila(D,'d2',"Diapirismul înseamnă:","ascensiunea sării",["topirea ghețarilor","erupția unui vulcan","eroziunea vântului"],"diapirism (ascensiunea sării)","Diapirism = ascensiunea (urcarea) sării.")
grila(D,'d2',"Cuestele sunt:","dealuri asimetrice formate pe straturi monoclinale",["vârfuri vulcanice","depresiuni glaciare","domuri gazeifere"],"dealuri asimetrice numite cueste","Cuestele – dealuri asimetrice, pe straturi monoclinale.")
grila(D,'d2',"Alunecările de teren apar mai ales în zonele cu:","argile",["calcar","gresii","tuf vulcanic"],"argilele sunt afectate de alunecări de teren","Argilele favorizează alunecările de teren.")
grila(D,'d2',"În sud-vest, la ieșirea Mureșului din depresiune, altitudinile scad sub:","400 m",["1000 m","800 m","100 m"],"sub 400 m în SV","Sub 400 m, la ieșirea Mureșului.",2)
af(D,'d2',"Altitudinile din Depresiunea Colinară a Transilvaniei cresc de la est la vest.",False,"Altitudinile scad de la peste 1000 m în est","Altitudinile SCAD de la est (peste 1000 m) spre sud-vest (sub 400 m).")
af(D,'d2',"Gresiile, marnele și calcarul sunt roci mai rezistente.",True,"mai rezistente (gresii, marne, calcar)","Corect.")
grila(D,'d3',"Subcarpații Transilvaniei sunt localizați în:","est, la contactul cu Carpații Orientali",["vest, lângă Apuseni","nord, lângă Someșe","sud, lângă Olt"],"localizați în est","Subcarpații Transilvaniei – în est.")
grila(D,'d3',"Cutele diapire sunt specifice:","Subcarpaților Transilvaniei",["Podișului Târnavelor","Câmpiei Transilvaniei","Podișului Someșan"],"cute diapire","Sarea a dus la cute diapire în Subcarpații Transilvaniei.",2)
grila(D,'d3',"Depresiunile de contact s-au format prin:","eroziunea selectivă a râurilor",["scufundare tectonică","erupții vulcanice","acțiunea ghețarilor"],"eroziunea selectivă","Eroziunea selectivă a Oltului, Mureșului și afluenților.")
grila(D,'d3',"Care NU este o depresiune de contact?","Depresiunea Ciuc",["Depresiunea Făgăraș","Depresiunea Sibiu","Depresiunea Huedin"],"Depresiuni: Făgăraș, Sibiu","Ciuc e în Carpații Orientali.",2)
grila(D,'d3',"Podișul Someșan este situat:","la nord de cele două Someșe",["la sud de Mureș","între Someșe și Mureș","în estul depresiunii"],"situat la nord de cele două Someșe","Podișul Someșan – la nord de Someșul Mic și Someșul Mare.")
grila(D,'d3',"Podișul Someșan înclină:","de la N spre S",["de la E spre V","de la S spre N","de la V spre E"],"Înclină de la N spre S","Podișul Someșan: N → S.",2)
grila(D,'d3',"Câmpia Transilvaniei este situată între:","Someșe și Mureș",["Mureș și Olt","Târnave și Olt","Barcău și Someș"],"situată între Someșe și Mureș","Între Someșe și Mureș.")
grila(D,'d3',"Câmpia Transilvaniei are altitudini de:","500–600 m",["100–200 m","peste 1000 m","sub 50 m"],"altitudini de 500–600 m","500–600 m – deci nu e o câmpie adevărată.",2)
grila(D,'d3',"Câmpia Transilvaniei este numită „câmpie” datorită:","utilizării agricole",["altitudinilor sub 200 m","reliefului perfect plan","prezenței sării"],"utilizării agricole","Numele vine de la utilizarea agricolă.",2)
grila(D,'d3',"Domurile gazeifere sunt specifice:","Câmpiei Transilvaniei",["Podișului Someșan","Subcarpaților Transilvaniei","Podișului Târnavelor"],"domuri gazeifere","Câmpia Transilvaniei are domuri gazeifere.",2)
grila(D,'d3',"Podișul Târnavelor înclină:","de la est spre vest",["de la N spre S","de la vest spre est","de la S spre N"],"Înclină de la est spre vest","Podișul Târnavelor: E → V.",2)
compl(D,'d3',"Depresiunile de contact: Făgăraș, Sibiu, Culoarul Alba Iulia – Turda și ……",["Huedin"],"Huedin","Huedin – în vest.",3)
add(D,'d3',"potrivire","Asociază diviziunea cu trăsătura ei.",src(D,"domuri gazeifere"),"Fiecare diviziune are „semnătura” ei.",2,
    coloanaA=["Subcarpații Transilvaniei","Podișul Someșan","Câmpia Transilvaniei","Podișul Târnavelor"],coloanaB=["cute diapire","cueste (structură monoclinală)","domuri gazeifere","înclină de la est spre vest","eroziune selectivă a râurilor"],perechi={"0":0,"1":1,"2":2,"3":3},distractor=[4])
add(D,'d4',"ordonare","Ordonează de la nord la sud: Podișul Someșan, Câmpia Transilvaniei, Podișul Târnavelor.",src(D,"situată între Someșe și Mureș"),"Someșan (N de Someșe) → Câmpia (între Someșe și Mureș) → Târnave (S de Mureș).",2,elemente=["Podișul Someșan","Câmpia Transilvaniei","Podișul Târnavelor"])
add(D,'d4',"cauza_efect","Asociază fiecare formă de relief/proces cu cauza lui.",src(D,"Datorită prezenței sării"),"Sare → diapirism; monoclinal → cueste; argile → alunecări.",2,
    perechi_corecte=[{"forma":"diapirism","cauza":"prezența sării"},{"forma":"cueste","cauza":"straturile monoclinale"},{"forma":"alunecări de teren","cauza":"prezența argilelor"},{"forma":"depresiuni de contact","cauza":"eroziunea selectivă a râurilor"}],de_rezolvat=4)
add(D,'d3',"cine_sunt","Cine sunt eu?",src(D,"domuri gazeifere"),"Câmpia Transilvaniei.",2,
    indicii=["Am aspect vălurit, 500–600 m.","Sunt între Someșe și Mureș.","Am domuri gazeifere și sunt folosită pentru agricultură."],raspuns="Câmpia Transilvaniei",variante=["Câmpia Transilvaniei","Podișul Someșan","Podișul Târnavelor","Subcarpații Transilvaniei"])
add(D,'d3',"cine_sunt","Cine sunt eu?",src(D,"structură monoclinală"),"Podișul Someșan.",2,
    indicii=["Am structură monoclinală.","Am cueste.","Sunt la nord de cele două Someșe."],raspuns="Podișul Someșan",variante=["Podișul Someșan","Podișul Târnavelor","Câmpia Transilvaniei","Munții Apuseni"])
add(D,'d3',"cine_sunt","Cine sunt eu?",src(D,"cele mai mari altitudini"),"Subcarpații Transilvaniei.",2,
    indicii=["Am cute diapire.","Am cele mai mari altitudini din depresiune.","Sunt în est, lângă Carpații Orientali."],raspuns="Subcarpații Transilvaniei",variante=["Subcarpații Transilvaniei","Podișul Târnavelor","Depresiunile de contact","Grupa Centrală a Carpaților Orientali"])

# --- Comparații (Venn) pentru toate perechile
add(M,'m5',"comparare","Compară Carpații Meridionali cu Carpații Orientali.",src(M,"orogenezei Alpine") if False else src(M,"orogenezei alpine"),"Ambii sunt munți tineri, dar Meridionalii sunt mai înalți și mai masivi.",3,
    unitati=["Carpații Meridionali","Carpații Orientali"],
    asemanari=["Ambii prezintă relief carstic","Ambii prezintă relief glaciar (Făgăraș, Retezat – Rodnei)"],
    deosebiri=["Meridionalii au altitudinea maximă 2544 m, Orientalii 2303 m","Meridionalii au culmi E–V, Orientalii NV–SE","Orientalii au relief vulcanic, Meridionalii nu","Meridionalii au masivitate accentuată, Orientalii fragmentare accentuată"],
    capcane=["Ambii au altitudinea medie de 640 m","Ambii sunt formați doar din roci vulcanice"],de_selectat=[2,2])
add(C,'c4',"comparare","Compară Carpații Occidentali cu Carpații Orientali.",src(C,"Prezintă relief carstic și vulcanic"),"Ambii au vulcani și carst, dar Orientalii sunt mai înalți.",3,
    unitati=["Carpații Occidentali","Carpații Orientali"],
    asemanari=["Ambii prezintă relief vulcanic","Ambii prezintă relief carstic","Ambii au fragmentare accentuată"],
    deosebiri=["Orientalii au altitudinea medie circa 1300 m, Occidentalii 640 m","Orientalii au relief glaciar (Rodnei), Occidentalii nu","Altitudinea maximă: 2303 m la Orientali, 1849 m la Occidentali"],
    capcane=["Ambii au altitudinea maximă peste 2500 m","Ambii au culmi orientate E–V"],de_selectat=[2,2])
add(C,'c4',"comparare","Compară Carpații Occidentali cu Carpații Meridionali.",src(C,"cea mai joasă și mai fragmentată"),"Meridionalii: înalți și masivi; Occidentalii: joși și fragmentați.",3,
    unitati=["Carpații Occidentali","Carpații Meridionali"],
    asemanari=["Ambii s-au format prin încrețire, în orogeneza alpină","Ambii prezintă relief carstic"],
    deosebiri=["Altitudinea medie: 640 m la Occidentali, 1150 m la Meridionali","Meridionalii au relief glaciar, Occidentalii nu","Occidentalii au relief vulcanic, Meridionalii nu","Occidentalii sunt foarte fragmentați, Meridionalii masivi"],
    capcane=["Ambii au altitudinea maximă 1849 m","Ambii sunt alcătuiți doar din conglomerate"],de_selectat=[2,2])

# --- Hartă: ambele sensuri pentru 1–15
H=json.load(open(OUT+'harta.json'))
reg={r['nr']:r for r in H['regiuni'] if r['activ']}
nivh={'orientali':'o6','meridionali':'m5','occidentali':'c4','dct':'d4'}
frag_h={'orientali':'Grupa nordică','meridionali':'Grupa Bucegi','occidentali':'Munții Apuseni','dct':'Podișul Someșan'}
for nr,r in reg.items():
    t=r['taram']; nm=r['nume']
    s_=[p for _,ps in L[t] for p in ps][0]
    add(t,nivh[t],"harta_atinge",f"Atinge pe hartă: {nm}.",s_,f"{nm} are numărul {nr} pe hartă.",1 if nr<=10 else 2,tinta=nr)
    alte=[reg[k]['nume'] for k in reg if k!=nr and reg[k]['taram']==t][:2]+[reg[k]['nume'] for k in reg if reg[k]['taram']!=t][nr%5:nr%5+1]
    v=[nm]+alte; random.shuffle(v)
    add(t,nivh[t],"harta_numar",f"Ce unitate are numărul {nr} pe hartă?",s_,f"Numărul {nr} = {nm}.",1,nr=nr,variante=v,corect=v.index(nm))

json.dump(X,open(OUT+'intrebari_extra.json','w'),ensure_ascii=False,indent=1)
from collections import Counter
print('extra',len(X),Counter(q['taram'] for q in X),Counter(q['tip'] for q in X))

# ---------------------------------------------------------------- INSIGNE
INS=[
 ("varful-moldoveanu","Vârful Moldoveanu","⛰️","15 răspunsuri corecte despre altitudini și vârfuri."),
 ("vulcanologul","Vulcanologul","🌋","10 răspunsuri corecte despre relieful vulcanic."),
 ("speologul","Speologul","🦇","10 răspunsuri corecte despre relieful carstic."),
 ("ghetarul","Ghețarul","🧊","8 răspunsuri corecte despre relieful glaciar."),
 ("sarea-pamantului","Sarea pământului","🧂","5 răspunsuri corecte despre diapirism și sare."),
 ("cuesta-perfecta","Cuesta perfectă","📐","5 răspunsuri corecte despre cueste și structura monoclinală."),
 ("ochi-de-cartograf","Ochi de cartograf","🗺️","10 identificări corecte pe hartă, la rând."),
 ("comparatorul","Comparatorul","⚖️","O comparație rezolvată perfect."),
 ("maestrul-olt","Maestrul râurilor","🌊","10 răspunsuri corecte despre râuri și limite."),
 ("seria-de-foc","Seria de foc","🔥","Ai învățat 5 zile la rând."),
 ("expeditia-1","Expediția 1","🏅","Testul nr. 1 terminat cu nota cel puțin 9."),
 ("expeditia-2","Expediția 2","🏆","Testul nr. 2 terminat cu nota cel puțin 9."),
 ("primul-pas","Primul pas","👣","Primul nivel terminat."),
 ("trei-stele","Trei stele","⭐","Un nivel terminat cu 3 stele."),
 ("cartograful-complet","Toate tărâmurile","🧭","Cel puțin o stea în fiecare nivel."),
 ("memorie-de-bufnita","Memorie de bufniță","🦉","20 de flashcard-uri ajunse în cutia 5."),
]
json.dump([{"id":a,"nume":b,"icon":c,"descriere":d} for a,b,c,d in INS],open(OUT+'insigne.json','w'),ensure_ascii=False,indent=1)
