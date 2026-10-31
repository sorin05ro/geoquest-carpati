import numpy as np,cv2,json
from PIL import Image
lab=np.load('/home/claude/tools/lab.npy'); im=np.array(Image.open('/home/claude/meta/harta_relief_romania_numerotata.png'))
clean=np.array(Image.open('/home/claude/tools/clean.png')).astype(int)
H,W=lab.shape; s=W/2000
def at(x,y): return lab[int(y*s),int(x*s)]
brown=(np.abs(clean-np.array([142,115,44])).sum(axis=2)<70)
big1=(lab==1)&brown
big1=cv2.morphologyEx(big1.astype(np.uint8),cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
n,l2,st,_=cv2.connectedComponentsWithStats(big1,connectivity=4)
def at2(x,y): return l2[int(y*s),int(x*s)]
masks={}
masks['1']=(l2==at2(920,250))
masks['8']=(l2==at2(390,920))
for k,(x,y) in {'2':(1200,520),'3':(1200,780),'6':(680,800),'7':(500,820),'9':(500,740),'10':(650,600),'11':(840,455),'12':(700,320),'13':(900,600),'14':(1050,560)}.items():
    c=at(x,y); assert c>1,(k,c); masks[k]=(lab==c)
dk=(lab==0)
bm=(brown&~dk).astype(np.uint8); bm=cv2.morphologyEx(bm,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
n3,l3,st3,cen3=cv2.connectedComponentsWithStats(bm,connectivity=4)
for i in range(1,n3):
    x,y,w,h,a=st3[i]
    if a>3000 and x>=320*s and x+w<=760*s and y>=290*s and y+h<=710*s and not (masks['9'][l3==i].any()):
        masks['10']|=(l3==i)
c=at(1060,770); m=(lab==c); xs=np.arange(W)[None,:].repeat(H,0)
cut=int(967*s); masks['5']=m&(xs<cut); masks['4']=m&(xs>=cut)
m15=np.zeros_like(m)
for x,y in [(600,720),(740,600),(815,740),(920,735),(1040,705)]: m15|=(lab==at(x,y))
masks['15']=m15
out={}
for k,m in masks.items():
    m=cv2.morphologyEx(m.astype(np.uint8)*255,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
    m=cv2.dilate(m,np.ones((7,7),np.uint8))   # cover half of the border line
    cs,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    cs=[c for c in cs if cv2.contourArea(c)>1500]
    out[k]=[cv2.approxPolyDP(c,3,True)[:,0,:].tolist() for c in cs]
    print(k,int(m.sum()/255),[len(p) for p in out[k]])
json.dump(out,open('/home/claude/tools/poly15.json','w'))
vis=np.array(Image.open('/home/claude/tools/harta_alb.png'))[:,:,::-1].copy()
rng=np.random.default_rng(7); ov=vis.copy()
for k,ps in out.items():
    col=tuple(int(v) for v in rng.integers(30,230,3))
    for p in ps: cv2.fillPoly(ov,[np.array(p)],col)
vis=cv2.addWeighted(vis,0.35,ov,0.65,0)
for k,ps in out.items():
    for p in ps: cv2.polylines(vis,[np.array(p)],True,(0,0,0),3)
cv2.imwrite('/tmp/claude-0/-home-claude/ed5d9018-7feb-5671-b460-f659ecd18eab/scratchpad/p15.jpg',cv2.resize(vis,(2000,int(2000*H/W))))
